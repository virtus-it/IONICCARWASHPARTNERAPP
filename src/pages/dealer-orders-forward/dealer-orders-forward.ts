import { Component } from '@angular/core';
import {App, IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-orders-forward',
  templateUrl: 'dealer-orders-forward.html',
})
export class DealerOrdersForwardPage {

  showProgress = true;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private platform: Platform,
              private  apiService: ApiProvider,
              private appCtrl:App) {
    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);


            //initial call
            this.fetchOrders(false,false,false,true,true);
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);


            //initial call
            this.fetchOrders(false,false,false,true,true);
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {
    //this.fetchOrders(false,false,true,"","");
  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "status": 'forwardedorders',
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
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> ORDERS: ORDERED : " + JSON.stringify(res));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {

            if (res.data[i].status == OrderTypes.ORDERED ||
              res.data[i].status == OrderTypes.ASSIGNED ||
              res.data[i].status == OrderTypes.ACCEPT ||
              res.data[i].status == OrderTypes.BACKTODEALER ||
              res.data[i].status == OrderTypes.NOT_BROADCASTED) {

              res.data[i]["orderstatus"] = "ASSIGN";

              if (res.data[i].status == OrderTypes.ORDERED ||
                res.data[i].status == OrderTypes.ACCEPT ||
                res.data[i].status == OrderTypes.BACKTODEALER ||
                res.data[i].status == OrderTypes.NOT_BROADCASTED)
                res.data[i]["statusUpdated"] = "Order Created";
              else if (res.data[i].status == OrderTypes.ASSIGNED)
                res.data[i]["statusUpdated"] = "Assigned to Service Agent";
            } else if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["orderstatus"] = "DELIVERED";
              res.data[i]["statusUpdated"] = "Order Delivered";
            } else if (res.data[i].status == OrderTypes.CANNOT_DELIVER) {
              res.data[i]["orderstatus"] = "CANT DELIVER";
            } else if (res.data[i].status == OrderTypes.DOORLOCK) {
              res.data[i]["orderstatus"] = "DOORLOCK";
            } else if (res.data[i].status == OrderTypes.NOT_REACHABLE) {
              res.data[i]["orderstatus"] = "NOT REACHABLE";
            } else if (res.data[i].status == OrderTypes.CANCELLED) {
              res.data[i]["orderstatus"] = "CANCELLED";
              res.data[i]["statusUpdated"] = "Order Cancelled";
            } else if (res.data[i].status == OrderTypes.ONHOLD) {
              res.data[i]["orderstatus"] = "ON HOLD";
              res.data[i]["statusUpdated"] = "Order is On Hold";
            }


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
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
      });

    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
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

  viewDetails(event, orderID, categoryID){
    if(orderID){
      this.appCtrl.getRootNav().push('DealerOrderDetailsPage',{
        orderid:orderID,
        categoryid:categoryID,
      });
    }
  }


}
