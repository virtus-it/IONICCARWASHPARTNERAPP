import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DealerStockNotificationsConfirmedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-confirmed',
  templateUrl: 'dealer-stock-notifications-confirmed.html',
})
export class DealerStockNotificationsConfirmedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerStockNotificationsConfirmedPage');
  }

}
