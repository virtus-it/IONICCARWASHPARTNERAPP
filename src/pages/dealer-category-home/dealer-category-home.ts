import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { UtilsProvider, APP_TYPE } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import {Camera, CameraOptions} from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: 'page-dealer-category-home',
  templateUrl: 'dealer-category-home.html',
})
export class DealerCategoryHomePage {
  isUpdate: any = false;
  imgUrl: any;
  list: any;
  type: string = "1";
  page1: boolean = true;
  page2: boolean = false;
  person = { "category": "", "priority": "", "desp": "", "categoryid": "" };
  btnText: string = "Save";

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertUtils: UtilsProvider,
    private apiService: ApiProvider,
              private camera: Camera,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) {

  }

  assetImg(){
    this.imgUrl = 'assets/imgs/img_user.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerCategoryHomePage');
  }

  ngOnInit() {
    this.fetchCategories();
  }

  delete(item) {
    let input = { "product": { "transtype": "delete", "categoryid": item.categoryid } };
    this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {
      console.log(res);
      if (res && res.data) {
        this.alertUtils.showToast("Category deleted successfully");
        this.fetchCategories();
      }
    })
  }
  update(item) {
    this.isUpdate = true;
    this.page1 = !this.page1;
    this.page2 = !this.page2;
    this.person.category = item.category;
    this.person.priority = item.priority;
    this.person.desp = item.category_desc;
    this.person.categoryid = item.categoryid;

    this.btnText = "Update";
  }
  back() {
    this.page1 = !this.page1;
    this.page2 = !this.page2;
  }
  add() {
    this.person.category = "";
    this.person.priority = "";
    this.person.desp = "";
    this.page1 = !this.page1;
    this.page2 = !this.page2;
    this.btnText = "Save";
  }

  save() {

    console.log(this.person);
    if (!this.alertUtils.validateText(this.person.category, "category", 2, 50)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }
    this.person.priority = "" + this.person.priority;
    if (!this.alertUtils.validateText(this.person.priority, "priority", 1, 50)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }
    if (!this.alertUtils.validateText(this.person.desp, "description", 1, 100)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }


    let input = { "product": { "cname": this.person.category, "cdesc": this.person.desp, "priority": this.person.priority, "loginid": UtilsProvider.USER_ID, "apptype": UtilsProvider.USER_TYPE } };



    if (this.btnText == "Update") {
      input.product["categoryid"] = this.person.categoryid;
      this.apiService.putReq(this.apiService.editCategory(), JSON.stringify(input)).then(res => {
        console.log(res);
        if (res && res.data) {
          this.alertUtils.showToast("Category update successfully");
          this.page1 = !this.page1;
          this.page2 = !this.page2;
          this.fetchCategories();
        }
      })

    } else {
      this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {
        console.log(res);
        if (res && res.data) {
          this.alertUtils.showToast("Category created successfully");
          this.page1 = !this.page1;
          this.page2 = !this.page2;
          this.fetchCategories();
        }
      })
    }


  }
  onImageError(item) {
    item.url = "http://placehold.it/500x200";
  }
  fetchCategories() {
    this.apiService.getReq(this.apiService.getProductCategory() + UtilsProvider.USER_ID + "/" + UtilsProvider.USER_TYPE + "/" + APP_TYPE).then(res => {
      console.log(res);
      if (res && res.data) {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          element["url"] = this.apiService.getImg() + "category_" + element.categoryid+".png";
        }
        this.list = res.data;
      }
    });
  }

  promptPickImage(item) {
    let prompt = this.alertCtrl.create({
      title: 'PICK IMAGE',
      /*message: 'Are you sure. You want delete customer?',*/
      buttons: [
        {
          text: 'Gallery',
          handler: data => {
            this.pickImage(item,0);
          }
        },
        {
          text: 'Camera',
          handler: data => {
            this.pickImage(item,1);
          }
        }
      ]
    });
    prompt.present();
  }

  pickImage(item,sourceType) {

    try {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 256,
        targetHeight: 256,
        sourceType:sourceType
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image =  imageData;

        if(base64Image && base64Image.length>0){
          this.uploadImg(base64Image,'category_'+item.categoryid);
        }

      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s,fileName){
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

}
