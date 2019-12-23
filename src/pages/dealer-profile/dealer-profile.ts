import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import {
  APP_TYPE,
  IMAGE_HEIGHT,
  IMAGE_WIDTH,
  KEY_USER_INFO,
  RES_SUCCESS,
  UserType,
  UtilsProvider
} from '../../providers/utils/utils';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-dealer-profile',
  templateUrl: 'dealer-profile.html',
})
export class DealerProfilePage {

  imgUrl: any;
  showProgress: any;
  showFlottingCash: boolean = false;
  person: any ={firstname: '', lastname: '', emailid: '', mobileno: '', address: '', flottingcash: ''};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private alertCtrl: AlertController,
              private camera: Camera,
              private platform: Platform,
              private apiService: ApiProvider,
              private actionSheetCtrl: ActionSheetController,
              private translateService: TranslateService) {
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
            this.getUserInfo();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO;
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.getUserInfo();
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  updateProfileInfo() {

    let showToast = false;

    if (this.alertUtils.validateText(this.person.firstname, 'First name', 3, 50)) {
      if (this.alertUtils.validateText(this.person.lastname, 'Last name', 1, 20)) {
        if (this.alertUtils.validateText(this.person.emailid, "Email id", 5, 50)) {
          if(this.alertUtils.isValidEmail(this.person.emailid)) {
            if (this.alertUtils.validateText(this.person.address, "address", 3, 100)) {

              let input = {
                "User": {
                  "userid": UtilsProvider.USER_ID,
                  "user_type": UtilsProvider.USER_TYPE,
                  "firstname": this.person.firstname,
                  "lastname": this.person.lastname,
                  "emailid": this.person.emailid,
                  "address": this.person.address,
                  "apptype": APP_TYPE
                }
              };

              this.alertUtils.showLog(JSON.stringify(input));
              let inputData = JSON.stringify(input);
              this.alertUtils.showLoading();

              this.apiService.putReq(this.apiService.updateProfile(), inputData).then(res => {
                  this.alertUtils.hideLoading();
                  this.alertUtils.showLog(res);
                  if (res.result == RES_SUCCESS) {
                    this.alertUtils.showToast("Profile updated successfully");

                  } else {
                    this.alertUtils.showToast("request failed ");
                  }

                }
              ).catch(error => {
                this.alertUtils.hideLoading();
                this.alertUtils.showLog(error)
              });

            } else
              showToast = true;
          }else
            this.alertUtils.showToast('Please enter proper email id');
        } else
          showToast = true;
      } else
        showToast = true;
    } else
      showToast = true;

    if (showToast) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }

  }

  getUserInfo() {
    this.apiService.getReq(this.apiService.getProfile() + UtilsProvider.USER_ID + "/" + APP_TYPE).then(res => {
      console.log(res);
      this.person = res.data.user;
      if (res.data.user.user_type == UserType.SUPPLIER)
        this.showFlottingCash = true;

      this.alertUtils.showLog('showFlottingCash ' + this.showFlottingCash);

      this.imgUrl = this.apiService.getImg() + UtilsProvider.USER_TYPE + '_' + this.person.userid + '.png?random' + Math.random();
      this.alertUtils.showLog('Img Url : ' + this.imgUrl);
    })
  }

  validate(s){
    return this.alertUtils.validate(s);
  }

  assetImg() {
    this.imgUrl = 'assets/imgs/img_user.png';
  }

  promptPickImage(event) {
    let prompt = this.alertCtrl.create({
      title: 'PICK IMAGE',
      /*message: 'Are you sure. You want delete customer?',*/
      buttons: [
        {
          text: 'Gallery',
          handler: data => {
            this.pickImage(0);
          }
        },
        {
          text: 'Camera',
          handler: data => {
            this.pickImage(1);
          }
        }
      ]
    });
    prompt.present();
  }

  chooseImageType() {
    if(this.platform.is('android') || this.platform.is('ios')) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Choose or take a picture',
        buttons: [
          {
            text: 'Take a picture',
            handler: () => {
              this.pickImage(1);
            }
          },
          {
            text: 'Choose pictures',
            handler: () => {
              this.pickImage(0);
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  pickImage(sourceType) {

    try {
      const options: CameraOptions = {
        quality: 40,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: IMAGE_WIDTH,
        targetHeight: IMAGE_HEIGHT,
        sourceType: sourceType
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = imageData;

        if (base64Image && base64Image.length > 0) {
          this.uploadImg(base64Image, UtilsProvider.USER_TYPE + '_' + UtilsProvider.USER_ID);
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

    this.showProgress = true;
    this.apiService.postReq(this.apiService.imgUpload(), JSON.stringify(input)).then(res => {
      this.showProgress = false;
      this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + res.data);

      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.getUserInfo();
      } else
        this.alertUtils.showToast(res.result);

    }, error => {
      this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
    })
  }

}
