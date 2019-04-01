import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-all',
  templateUrl: 'dealer-stock-notifications-all.html',
})
export class DealerStockNotificationsAllPage {

  IS_PAGING: boolean = false;
  IS_REFRESH: boolean = false;
  showProgress = true;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private network: NetworkProvider,
              private  apiService: ApiProvider

  ) {
  }

  ionViewDidLoad() {
    this.fetchOrders(false,false,false,true,true);
  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFrist: boolean, paging, refresher) {
    try {

      let url = this.apiService.orderByStatus();

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "status": 'all',
          "pagesize": '10',
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      if (isPaging) {
        input.order["last_orderid"] = this.response[this.response.length - 1].order_id;
      } else {
        input.order["last_orderid"] = '0';
      }

      let data = JSON.stringify(input);
      if (isFrist) {
        this.showProgress = true;
      }

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.orderByStatus(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog("POST (SUCCESS)=> ORDERS: ALL : " + JSON.stringify(res));

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
    if (isPaging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }

  }

  loadDataInfinite(event) {
    this.IS_PAGING = true;
    this.IS_REFRESH = false;

    //this.last_record = this.orders[this.orders.length - 1].order_id;

    this.loadData();
    event.target.complete();
  }

  loadData() {

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


}
