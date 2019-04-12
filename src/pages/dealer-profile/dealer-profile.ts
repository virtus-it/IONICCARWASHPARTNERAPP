import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import {UtilsProvider, APP_TYPE, APP_USER_TYPE, RES_SUCCESS, UserType} from '../../providers/utils/utils';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-dealer-profile',
  templateUrl: 'dealer-profile.html',
})
export class DealerProfilePage {
  person: any;
  imgUrl: any;
  showProgress: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private alertCtrl: AlertController,
              private camera: Camera,
              private apiService: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerProfilePage');
  }

  save() {
    let input = {
      "User": {
        "userid": UtilsProvider.USER_ID,
        "user_type": APP_USER_TYPE,
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
  }


  getUserInfo() {
    this.apiService.getReq(this.apiService.getProfile() + UtilsProvider.USER_ID + "/" + APP_TYPE).then(res => {
      console.log(res);
      this.person = res.data.user;
      this.imgUrl = this.apiService.getImg()+UtilsProvider.USER_TYPE+'_'+this.person.userid+'.png';
      this.alertUtils.showLog('Img Url : '+this.imgUrl);
    })
  }
  ngOnInit() {
    this.getUserInfo();
  }

  assetImg(){
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

  pickImage(sourceType) {

    try {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 100,
        targetHeight: 100,
        sourceType:sourceType
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/png;base64,' + imageData;

        if(base64Image && base64Image.length>0){
          this.uploadImg(base64Image,UtilsProvider.USER_TYPE+'_'+UtilsProvider.USER_ID+'.png');
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

    this.showProgress = true;
    this.apiService.postReq(this.apiService.imgUpload(), JSON.stringify(input)).then(res => {
      this.showProgress = false;
      this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + JSON.stringify(res.data));

      if (res.result == this.alertUtils.RESULT_SUCCESS) {

      } else
        this.alertUtils.showToast(res.result);

    }, error => {
      this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
    })
  }

}
