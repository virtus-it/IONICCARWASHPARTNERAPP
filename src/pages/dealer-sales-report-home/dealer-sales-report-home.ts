import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";

/**
 * Generated class for the DealerSalesReportHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-sales-report-home',
  templateUrl: 'dealer-sales-report-home.html',
})
export class DealerSalesReportHomePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private platform: Platform,
              public alertUtils: UtilsProvider) {
    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerSalesReportHomePage');
  }

}
