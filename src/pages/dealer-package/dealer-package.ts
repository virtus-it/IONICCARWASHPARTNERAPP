import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, INTERNET_ERR_MSG, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {Camera, CameraOptions} from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: 'page-dealer-package',
  templateUrl: 'dealer-package.html',
})
export class DealerPackagePage {

  currentSeg: string;
  isUpdate: any = false;
  imgUrl: any;
  list: any;
  type: string = "1";
  page1: boolean = true;
  page2: boolean = false;
  person = {
    "type": "category", "category": "", "priority": "",
    "desp": "", "categoryid": "", imgUrl: ""
  };
  btnText: string = "Save";

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private camera: Camera, private ref: ChangeDetectorRef, private modalCtrl: ModalController,
              private alertCtrl: AlertController) {

    try {
      this.alertUtils.initUser(this.alertUtils.getUserInfo());
    } catch (e) {
      console.log(e);
    }


  }

  assetImg() {
    this.imgUrl = 'assets/imgs/img_repairing_service.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerCategoryHomePage');
  }

  ngOnInit() {
    this.fetchPackages();
  }

  update(item) {
    console.log(this.currentSeg);
    this.isUpdate = true;
    this.page1 = !this.page1;
    this.page2 = !this.page2;
    this.person.type = item.type;
    this.person.category = item.category;
    this.person.priority = item.priority;
    this.person.desp = item.category_desc;
    this.person.categoryid = item.categoryid;
    this.person.imgUrl = this.apiService.getImg() + "category_" + item.categoryid + ".png";
    this.btnText = "Update";

    this.ref.detectChanges();
  }

  onImageError(item) {
    item.url = "http://placehold.it/500x200";
  }

  fetchPackages() {
    let input = {
      "product": {
        "transtype": "getallpackages",
        "loginid": UtilsProvider.USER_ID,
        "apptype": APP_TYPE
      }
    };


    try {
      this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {
        console.log(res);
        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            element["url"] = this.apiService.getImg() + "category_" + element.categoryid + ".png";
          }
          this.list = res.data;
        }
      }, err => {
        console.log(err);
      })
    }catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  pickImage(item, sourceType) {

    try {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 256,
        targetHeight: 256,
        sourceType: sourceType
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = imageData;

        if (base64Image && base64Image.length > 0) {
          this.uploadImg(base64Image, 'category_' + item.categoryid);
        }

      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s, fileName) {
    let input = {
      "image": {
        "filename": fileName,
        "base64string": s,
      }
    };


    this.apiService.postReq(this.apiService.imgUpload(), JSON.stringify(input)).then(res => {
      this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + res.data);

      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.showToast('success');
      } else
        this.alertUtils.showToast(res.result);

    }, error => {
      this.alertUtils.showLog("POST (ERROR)=> IMAGE UPLOAD: " + error);
    })
  }

  createPackage(event, package1) {
    if (package1 == '')
      this.alertUtils.showLog('package : create');
    else
      this.alertUtils.showLog('package : update');
    let model = this.modalCtrl.create('DealerPackageCreatePage', {
      from: 'package',
      item: package1,
      payments: package1.payments,
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          if (data.actionType == 'create')
            this.alertUtils.showToast('Package successfully created');
          else
            this.alertUtils.showToast('Package successfully updated');

          this.fetchPackages();

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

}
