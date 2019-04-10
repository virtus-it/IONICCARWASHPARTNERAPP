import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider, APP_TYPE, APP_USER_TYPE, RES_SUCCESS } from '../../providers/utils/utils';

/**
 * Generated class for the DealerProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-profile',
  templateUrl: 'dealer-profile.html',
})
export class DealerProfilePage {
  person: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private alertUtils: UtilsProvider,
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

    })
  }
  ngOnInit() {
    this.getUserInfo();
  }

}
