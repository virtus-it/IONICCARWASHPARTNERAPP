import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-pending',
  templateUrl: 'dealer-stock-notifications-pending.html',
})
export class DealerStockNotificationsPendingPage {

  IS_PAGING: boolean = false;
  IS_REFRESH: boolean = false;
  showProgress = true;
  private response: any;
  private noRecords = false;
  from:string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private network: NetworkProvider,
              private  apiService: ApiProvider) {
    try {
      this.from = this.navParams.get('from');
    }catch (e) {
      this.from = '';
    }

  }

  ionViewDidLoad() {
    this.fetchOrders(false,false,true,'','');
  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFrist: boolean, paging, refresher) {
    try {

      let input;

      if(this.from == 'distributor') {
        input = {
          "root": {
            "userid": this.navParams.get('userID'),
            "usertype": UtilsProvider.USER_TYPE,
            "viewtype": 'notification',
            "status": 'all',
            "distributorid": this.navParams.get('distributorID'),
            "dealerid": UtilsProvider.USER_DEALER_ID,
            "pid": '0',
            "pagesize": '10',
            "framework": FRAMEWORK,
            "apptype": APP_TYPE
          }
        };
      }else {
        input = {
          "root": {
            "userid": UtilsProvider.USER_ID,
            "usertype": UtilsProvider.USER_TYPE,
            "viewtype": 'allnotification',
            "status": 'stockrequested',
            "dealerid": UtilsProvider.USER_DEALER_ID,
            "pid": '0',
            "pagesize": '10',
            "framework": FRAMEWORK,
            "apptype": APP_TYPE
          }
        };
      }


      if (isPaging) {
        input.root["lastid"] = this.response[this.response.length - 1].order_id;
      } else {
        input.root["lastid"] = '0';
      }

      let data = JSON.stringify(input);

      this.alertUtils.showLog('data : '+data);

      this.apiService.postReq(this.apiService.getStockRequests(), data).then(res => {
        this.hideProgress(isFrist,isRefresh,isPaging,'','');
        this.alertUtils.showLog("POST (SUCCESS)=> STOCK: ALL : " + JSON.stringify(res));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {

            if (isPaging)
              this.response.push(res.data[i]);
          }
        }

      }, error => {
        this.alertUtils.hideLoading();
      });

    } catch (e) {
      this.alertUtils.hideLoading();
    }
  }

  hideProgress(isFirst, isRefresh, isPaging, paging, refresher) {
    if (isFirst) {
      this.showProgress = false;
    }
    if (isPaging && paging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }

  }

  doRefresh(refresher) {
    this.fetchOrders(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchOrders(true, false, false, paging, "");
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
  }

  calculateTotalCost(cans:string, cost:string):string{
    if(cans && cost){
      return (+cans * +cost).toString();
    }else
      return '';
  }

}
