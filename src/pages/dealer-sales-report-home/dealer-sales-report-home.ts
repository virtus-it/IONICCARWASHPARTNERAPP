import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";

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
              public alertUtils: UtilsProvider) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerSalesReportHomePage');
  }

}
