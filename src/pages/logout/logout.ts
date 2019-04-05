import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.logout();
  }

  logout(){
    UtilsProvider.setValues('','','','','','','','','');
    this.navCtrl.setRoot(LoginPage)
  }

}
