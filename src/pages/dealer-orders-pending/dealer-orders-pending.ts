import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the DealerOrdersPendingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dealer-orders-pending',
  templateUrl: 'dealer-orders-pending.html',
})
export class DealerOrdersPendingPage {

  orders: string[] =[];
  baseImgUrl:string;
  extensionPng:string='.png';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private network:NetworkProvider,
              private  apiUrl: ApiProvider,
              private alertUtils: UtilsProvider,
              private menuCtrl: MenuController) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {

    this.menuCtrl.enable(true);

    this.baseImgUrl = this.apiUrl.imageDownload()+'product_';

    let url = this.apiUrl.orderByStatus();

    let input = {
      "order": {
        "userid": UtilsProvider.USER_ID,
        "usertype": UtilsProvider.USER_TYPE,
        "status": 'pending',
        "pagesize": '10',
        "last_orderid": '0',
        "framework": FRAMEWORK,
        "apptype": APP_TYPE
      }
    };

    let data = JSON.stringify(input);

   /* //this.utils.showLoading();
    this.network.postReq(url,data).then(res=>{
      //this.utils.hideLoading();
      this.utils.showLog("POST (SUCCESS)=> ORDERS: ALL : "+JSON.stringify(res));
      this.orders = res.data;
    },error=>{
      this.utils.showLog("POST (ERROR)=> ORDERS: ALL : "+error);
      //this.utils.hideLoading();
    })*/

  }

}
