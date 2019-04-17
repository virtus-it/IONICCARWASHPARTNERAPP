import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";

/**
 * Generated class for the DealerMarketPlacePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-market-place',
  templateUrl: 'dealer-market-place.html',
})
export class DealerMarketPlacePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertUtils: UtilsProvider) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerMarketPlacePage');
  }

}
