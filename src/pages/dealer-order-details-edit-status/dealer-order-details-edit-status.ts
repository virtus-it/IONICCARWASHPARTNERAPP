import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilsProvider} from "../../providers/utils/utils";


@IonicPage()
@Component({
  selector: 'page-dealer-order-details-edit-status',
  templateUrl: 'dealer-order-details-edit-status.html',
})
export class DealerOrderDetailsEditStatusPage {

  input = {
    orderStatus: ""
  };
  order:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              public alertUtils:UtilsProvider) {
    this.order = navParams.get('order');
    this.alertUtils.showLog('Order : '+JSON.stringify(this.order));
  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

}
