import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, UserType, UtilsProvider} from "../../providers/utils/utils";
import {TranslateService} from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              public alertUtils: UtilsProvider,
              private translateService: TranslateService) {
                let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);
  }

  ionViewDidLoad() {
    //this.logout();
    this.showPromptForDelete();
  }

  logout(){
    UtilsProvider.setUSER_INFO('');
    this.alertUtils.initUser('');
    try {
      this.alertUtils.setUserInfo('').then((success) => {
        this.alertUtils.showLog('User Info Updated : '+success);
      }, error => {
        this.alertUtils.showLog('User Info Updated : '+error);
      });
    }catch (e) {
      this.alertUtils.showLog(e);
    }
    this.navCtrl.setRoot('LoginPage')
  }

  showPromptForDelete() {
    let prompt = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure. You want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Sure',
          handler: data => {
            this.logout();
          }
        }
      ]
    });
    prompt.present();
  }

}
