import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";

/**
 * Generated class for the DealerTrackSupplierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-track-supplier',
  templateUrl: 'dealer-track-supplier.html',
})
export class DealerTrackSupplierPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertUtils: UtilsProvider) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerTrackSupplierPage');
  }

}
