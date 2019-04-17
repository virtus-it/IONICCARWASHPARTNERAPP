import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";
// import {LoginPage} from "../login/login";
// import {RegisterPage} from "../register/register";


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertUtils: UtilsProvider) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  loadLoginPage(){
    this.navCtrl.push('LoginPage');
  }

  loadSignUpPage(){
    this.navCtrl.push('RegisterPage');
  }

}
