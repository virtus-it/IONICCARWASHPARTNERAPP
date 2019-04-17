import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import {LoginPage} from "../login/login";
// import {RegisterPage} from "../register/register";


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
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
