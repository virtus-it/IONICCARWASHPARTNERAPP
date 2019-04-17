import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, OrderTypes, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-supplier-orders-completed',
  templateUrl: 'supplier-orders-completed.html',
})
export class SupplierOrdersCompletedPage {

  showProgress = true;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private  apiService: ApiProvider,
              private appCtrl: App) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
  }

  ionViewDidLoad() {
    this.fetchOrders(false, false, true, "", "");
  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.SUPPLIER,
          "status": 'delivered',
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
      if (isFirst) {
        this.showProgress = true;
      }

      //this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.orderByStatus(), data).then(res => {
        this.alertUtils.hideLoading();
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> ORDERS: ORDERED : " + JSON.stringify(res));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {

            if (res.data[i].status == OrderTypes.ORDERED ||
              res.data[i].status == OrderTypes.ASSIGNED ||
              res.data[i].status == OrderTypes.BACKTODEALER ||
              res.data[i].status == OrderTypes.NOT_BROADCASTED) {

              res.data[i]["orderstatus"] = "assigned";
              res.data[i]["statusUpdated"] = "Job Assigned";
            } else if (res.data[i].status == OrderTypes.ACCEPT) {
              res.data[i]["orderstatus"] = "accepted";
              res.data[i]["statusUpdated"] = "Job Accepted";
            } else if (res.data[i].status == OrderTypes.ORDER_STARTED) {
              res.data[i]["orderstatus"] = "orderstarted";
              res.data[i]["statusUpdated"] = "You started to visit";
            } else if (res.data[i].status == OrderTypes.JOB_STARTED) {
              res.data[i]["orderstatus"] = "jobstarted";
              res.data[i]["statusUpdated"] = "Job Started";
            } else if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["orderstatus"] = "delivered";
              res.data[i]["statusUpdated"] = "Job Completed";
            } else if (res.data[i].status == OrderTypes.CANCELLED) {
              res.data[i]["orderstatus"] = "cancelled";
              res.data[i]["statusUpdated"] = "Job Cancelled";
            } else if (res.data[i].status == OrderTypes.ONHOLD) {
              res.data[i]["orderstatus"] = "onhold";
              res.data[i]["statusUpdated"] = "Job is On Hold";
            }

            if (isPaging)
              this.response.push(res.data[i]);
          }
        }

      }, error => {
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      });

    } catch (e) {
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
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

  viewDetails(event, orderID, categoryID) {
    if (orderID) {
      this.appCtrl.getRootNav().push('SupplierOrderDetailsPage', {
        orderid: orderID,
        categoryid: categoryID,
      });
    }
  }
}
