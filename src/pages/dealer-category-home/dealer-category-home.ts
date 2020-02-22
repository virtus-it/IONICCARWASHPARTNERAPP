import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams, Platform } from 'ionic-angular';
import { APP_TYPE, INTERNET_ERR_MSG, KEY_USER_INFO, UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { Camera, CameraOptions } from "@ionic-native/camera";
import {TranslateService} from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-dealer-category-home',
  templateUrl: 'dealer-category-home.html',
})
export class DealerCategoryHomePage {
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
  title: string = "Category";
  private base64Image: any;
  private isDealer: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertUtils: UtilsProvider,
    private apiService: ApiProvider,
    private platform: Platform,
    private camera: Camera, private ref: ChangeDetectorRef, private modalCtrl: ModalController,
    private alertCtrl: AlertController,private translateService: TranslateService) {

    try {
      this.platform.ready().then(ready => {
        let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);

        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchCategories('');
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchCategories('');
          }
        });
      });

      if(UtilsProvider.ISSUPER_DEALER){
        this.isDealer = true;
      }else{
        this.isDealer = false;
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }


  doRefresh(refresher) {
    this.fetchCategories(refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  viewServices(item) {

    this.navCtrl.push('DealerProductsPage', { item: item });
  }

  assetImg() {
    this.imgUrl = 'assets/imgs/img_repairing_service.png';
    this.person.imgUrl = 'assets/imgs/img_repairing_service.png';
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    //this.fetchCategories();
  }

  delete(item) {

    let alert = this.alertCtrl.create({
      title: 'WARNING',
      message: 'Are you sure you want to do this operation?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'YES',
          handler: () => {
            if (this.alertUtils.networkStatus()) {

              let input = { "product": { "transtype": "delete", "isactive": 0, "categoryid": item.categoryid } };
              if (item.isactive == 0 || item.isactive == null) {
                input.product.isactive = 1
              }
              this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {
                if (res && res.data) {
                  if(item.isactive == 0) {
                    this.alertUtils.showToast("Category successfully enabled");
                  }else{
                    this.alertUtils.showToast("Category successfully disabled");
                  }
                  this.fetchCategories('');
                }
              });
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();

  }
  onSegmentChange() {
    this.currentSeg = JSON.stringify(JSON.parse(this.type))
    if (this.currentSeg == "1") {
      this.title = "Category";
    } else {
      this.title = "Package";
    }

    this.title = "Category";

  }
  update(item) {
    if (this.currentSeg == "1") {
      this.title = "Update category";
    } else {
      this.title = "Update package";

    }

    this.title = "Update category";
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

  back() {

    this.page1 = !this.page1;
    this.page2 = !this.page2;
    if (this.currentSeg == "1") {
      this.title = "Category";
    } else {
      this.title = "Package";
    }

    this.title = "Category";
  }

  add() {

    if (this.currentSeg == "1") {
      this.title = "Create category";
    } else {
      this.title = "Create package";

    }
    this.title = "Create category";

    this.person.type = "";
    this.person.category = "";
    this.person.priority = "";
    this.person.desp = "";
    this.page1 = !this.page1;
    this.page2 = !this.page2;
    this.person.imgUrl = this.imgUrl;
    this.btnText = "Save";

    this.ref.detectChanges();

  }

  save() {

    if (!this.alertUtils.validateText(this.person.category, "name", 2, 50)) {
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


    let input = {
      "product": {
        "type": this.person.type,
        "cname": this.person.category,
        "cdesc": this.person.desp,
        "priority": this.person.priority,
        "loginid": UtilsProvider.USER_ID,
        "apptype": APP_TYPE
      }
    };


    if (this.btnText == "Update") {
      input.product["categoryid"] = this.person.categoryid;
      this.apiService.putReq(this.apiService.editCategory(), JSON.stringify(input)).then(res => {

        if (res && res.data) {
          this.alertUtils.showToast("Category update successfully");
          this.page1 = !this.page1;
          this.page2 = !this.page2;
          if (this.base64Image && this.base64Image.length > 0) {
            this.uploadImg(this.base64Image, 'category_' + this.person.categoryid);
          }
          this.fetchCategories('');
        }
      }, err => {
      })

    } else {
      this.apiService.postReq(this.apiService.createCategory(), JSON.stringify(input)).then(res => {

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          if (res && res.data) {
            this.alertUtils.showToast("Category created successfully");
            this.page1 = !this.page1;
            this.page2 = !this.page2;
            if (this.base64Image && this.base64Image.length > 0) {
              this.uploadImg(this.base64Image, 'category_' + res.data.categoryid);
            }
            this.fetchCategories('');
          }
        }else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, err => {

      })
    }


  }

  onImageError(item) {
    item.url = "http://placehold.it/500x200";
  }

  fetchCategories(refresher) {
    this.apiService.getReq(this.apiService.getProductCategory() + UtilsProvider.USER_ID + "/" + UtilsProvider.USER_TYPE + "/" + APP_TYPE).then(res => {

      if (refresher) {
        refresher.complete();
      }
      if (res && res.data) {
        for (let i = 0; i < res.data.length; i++) {
          const element = res.data[i];
          element["url"] = this.apiService.getImg() + "category_" + element.categoryid + ".png";
          if (!element.isactive) {
            element.isactive = 0;
          }
        }
        this.list = res.data;
        this.title = "Category";

      }
    }, err => {
      if (refresher) {
        refresher.complete();
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
            this.pickImage(item, 0);
          }
        },
        {
          text: 'Camera',
          handler: data => {
            this.pickImage(item, 1);
          }
        }
      ]
    });
    prompt.present();
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
        sourceType: sourceType,
        allowEdit:true
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = imageData;

        if (base64Image && base64Image.length > 0) {
          this.base64Image = base64Image;
          this.person.imgUrl = "data:image/jpeg;base64," + this.base64Image;

          // this.person.imgUrl = this.base64Image;l
          // this.uploadImg(base64Image, 'category_' + item.categoryid);
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

}
