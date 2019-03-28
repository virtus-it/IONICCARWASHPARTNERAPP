import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-orders-all',
  templateUrl: 'dealer-orders-all.html',
})
export class DealerOrdersAllPage {

  IS_PAGING: boolean = false;
  IS_REFRESH: boolean = false;
  showProgress = true;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private network: NetworkProvider,
              private  apiService: ApiProvider,
              private menuCtrl: MenuController) {
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
            /*res.data[i]["commentstext"] = "Show Comments";
            res.data[i]["showcommentsbox"] = false;
            if (res.data[i].status == "onhold") {
              res.data[i]["orderstatus"] = "Onhold";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "Cancelled" || res.data[i].status == "cancelled") {
              res.data[i]["orderstatus"] = "Cancelled";
              res.data[i]["statusColor"] = "danger";
              res.data[i]["trackingmessage"] = "Not delivered: Cancelled";
              res.data[i]["assigncolor"] = "danger";
              res.data[i]["completedcolor"] = "danger";
              if (res.data[i].order_by)
                res.data[i]["defindimg"] = this.apiService.getImg() + "customer_" + res.data[i].order_by;
            } else if (res.data[i].status == "rejected" || res.data[i].status == "Rejected") {
              res.data[i]["orderstatus"] = "Rejected";
              res.data[i]["statusColor"] = "danger";
              res.data[i]["trackingmessage"] = "Not delivered: Rejected";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "danger";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "assigned") {
              res.data[i]["statusColor"] = "warning";
              res.data[i]["orderstatus"] = "Assigned to supplier";
              res.data[i]["trackingmessage"] = "Delivered";
              res.data[i]["assigncolor"] = "success";
              res.data[i]["completedcolor"] = "";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "delivered" || res.data[i].status == "Delivered") {
              res.data[i]["orderstatus"] = "Delivered";
              res.data[i]["statusColor"] = "success";
              res.data[i]["trackingmessage"] = "Delivered";
              res.data[i]["assigncolor"] = "success";
              res.data[i]["completedcolor"] = "success";

              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "doorlock" || res.data[i].status == "Door Locked") {
              res.data[i]["orderstatus"] = "Door Locked";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "Not delivered: Door - Locked";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "cannot_deliver" || res.data[i].status == "Cant Deliver") {
              res.data[i]["orderstatus"] = "Cant Deliver";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "Not Reachable" || res.data[i].status == "not_reachable") {
              res.data[i]["orderstatus"] = "Not Reachable";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              res.data[i]["trackingmessage"] = "Your order is unable to deliver due to your un-availability";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "pending") {
              res.data[i]["orderstatus"] = "Pending";
              res.data[i]["statusColor"] = "primary";
              res.data[i]["trackingmessage"] = "Delivered";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "ordered" || res.data[i].status == "backtodealer" || res.data[i].status.toLowerCase() == "accept") {
              res.data[i]["orderstatus"] = "Order Placed";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "Delivered";
              if (res.data[i].dealerdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "dealer_" + res.data[i].dealerdetails.userid;
            } else {
              res.data[i]["orderstatus"] = res.data[i].status;
              if (res.data[i].dealerdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].dealerdetails.userid;
            }
            if (res.data[i].paymenttype == "cod"
              || res.data[i].paymenttype == "cash") {
              res.data[i].paymenttype = "COD";
            } else if (res.data[i].paymenttype == "credit") {
              res.data[i].paymenttype = "CREDIT";
            }*/

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
