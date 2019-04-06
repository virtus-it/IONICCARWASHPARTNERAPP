import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, OrderTypes, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import 'rxjs/add/observable/interval';
import {Observable, Subscription} from "rxjs";
import {Geolocation} from '@ionic-native/geolocation/ngx';

@IonicPage()
@Component({
  selector: 'page-supplier-orders-all',
  templateUrl: 'supplier-orders-all.html',
})
export class SupplierOrdersAllPage {

  showProgress = true;
  sub: Subscription;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private  apiService: ApiProvider,
              private geolocation: Geolocation,
              private appCtrl: App) {
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
              res.data[i].status == OrderTypes.ACCEPT ||
              res.data[i].status == OrderTypes.BACKTODEALER ||
              res.data[i].status == OrderTypes.NOT_BROADCASTED) {

              res.data[i]["orderstatus"] = "ASSIGN";

              if (res.data[i].status == OrderTypes.ORDERED ||
                res.data[i].status == OrderTypes.NOT_BROADCASTED ||
                res.data[i].status == OrderTypes.ASSIGNED)
                res.data[i]["statusUpdated"] = "Order Assigned";
            } else if (res.data[i].status == OrderTypes.ACCEPT) {
              res.data[i]["statusUpdated"] = "Order Accepted";
            } else if (res.data[i].status == OrderTypes.ORDER_STARTED) {
              res.data[i]["statusUpdated"] = "ORDER STARTED";
            } else if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["orderstatus"] = "DELIVERED";
              res.data[i]["statusUpdated"] = "Order Delivered";
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
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      });

    } catch (e) {
      this.alertUtils.hideLoading();
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
      this.appCtrl.getRootNav().push('DealerOrderDetailsPage', {
        orderid: orderID,
        categoryid: categoryID,
      });
    }
  }

  updateOrderStatus(event, i, status) {
    try {
      let input = {
        "order": {
          "orderid": this.response[i].order_id,
          "status": status,
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.SUPPLIER,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE,
        }
      };

      this.alertUtils.showLog(JSON.stringify(input));

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.changeOrderStatus(), JSON.stringify(input)).then(res => {
        this.alertUtils.showLog("POST (SUCCESS)=> CHANGE ORDER STATUS: " + JSON.stringify(res.data));
        this.alertUtils.hideLoading();

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          if (status == 'accept')
            this.alertUtils.showToast('Order accepted');
          else if (status == 'backtodealer')
            this.alertUtils.showToast('Order rejected');
          else if (status == 'orderstarted') {
            this.alertUtils.showLog('order started');
            this.getLocation(i);
          }
        } else
          this.alertUtils.showToast(res.result);

        this.fetchOrders(false, false, false, '', '');

      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
        this.alertUtils.hideLoading();
      })
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }

  getLocation(i) {
    this.alertUtils.showToast('Tracking Initialized');
    this.sub = Observable.interval(10000).subscribe((val) => {
      try {
        let watch = this.geolocation.watchPosition({maximumAge: 0, timeout: 10000, enableHighAccuracy: true});
        watch.subscribe((data) => {
          this.alertUtils.showLog("lat : " + data.coords.latitude + "\nlog : " + data.coords.longitude + "\n" + new Date());
          if(data && data.coords && data.coords.latitude && data.coords.longitude){
            this.trackingUpdate(data,i);
          }
        });
      } catch (e) {
        this.alertUtils.showLog(e);
      }

    }, (error) => {
      this.alertUtils.showLog("error");
    })
  }

  trackingUpdate(data, i) {
    //{"root":{"classificationid":"123","latitude":"17.20","longitude":"12.20","userid":"4567","transtype":"create"}}
    try {
      let input = {
        "root": {
          "classificationid": this.response[i].order_id,
          "latitude": data.coords.latitude,
          "longitude": data.coords.longitude,
          "transtype": 'create',
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.SUPPLIER,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE,
        }
      };

      this.alertUtils.showLog(JSON.stringify(input));
      this.apiService.postReq(this.apiService.tracking(), JSON.stringify(input)).then(res => {
        this.alertUtils.showLog("POST (SUCCESS)=> TRACKING: " + JSON.stringify(res.data));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {

        }

      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> TRACKING: " + error);
        this.alertUtils.hideLoading();
      })
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }

}
