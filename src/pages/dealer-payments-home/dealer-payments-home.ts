import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, RES_SUCCESS, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-payments-home',
  templateUrl: 'dealer-payments-home.html',
})
export class DealerPaymentsHomePage {

  showProgress = true;
  private response: any;
  private noRecords = false;
  private userType= UtilsProvider.USER_TYPE;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private  apiService: ApiProvider,
              private platform: Platform,
              private appCtrl: App) {

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false, false, true, "", "");
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false, false, true, "", "");
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {
    /*this.fetchOrders(false, false, true, "", "");*/
  }

  changeStatus(action, item) {
    try {
      if (UtilsProvider.USER_ID) {
        let input = {
          "root": {
            "paymentid": item.paymentid,
            "received_amt": item.amount_received,
            "orderid": item.orderid,
            "customerid": item.customer.userid,
            "status": "confirm",
            "userid": UtilsProvider.USER_ID,
            "usertype": UtilsProvider.USER_TYPE,
            "loginid": UtilsProvider.USER_ID,
            "apptype": APP_TYPE
          }
        };
        if (action != 'confirm') {
          input.root.status = "rejected";
        }

        this.alertUtils.showLog(JSON.stringify(input));

        this.apiService.postReq(this.apiService.changePaymentStatus(), input).then(res => {
          if (res.result == RES_SUCCESS && res.data) {
            this.alertUtils.showToast("Payment status updated successfully");
            this.fetchOrders(false, false, true, "", "");

          }
        });
      }

    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

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
        input.order["last_paymentid"] = this.response[this.response.length - 1].paymentid;
      } else {
        input.order["last_paymentid"] = '0';
      }

      let data = JSON.stringify(input);
      if (isFirst) {
        this.showProgress = true;
      }

      //this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.getPaymentDetailsByUserID(), data).then(res => {
        this.alertUtils.hideLoading();
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog(res);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {

            if (res.data[i].status == 'confirm') {
              res.data[i]['statustext'] = "Payment Confirmed"
            }else if(res.data[i].status == 'rejected'){
              res.data[i]['statustext'] = "Payment Rejected"
            }else if(res.data[i].status == 'received'){
              res.data[i]['statustext'] = "Payment Received"
            }else{
              res.data[i]['statustext'] = res.data[i].status;
            }

            //updating bill amount
            if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["billamt_updated"] = res.data[i].bill_amount;
            } else
              res.data[i]["billamt_updated"] = res.data[i].orderamt;

            if (isPaging)
              this.response.push(res.data[i]);
          }
        }else{
          if (!isPaging)
            this.noRecords = true;
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

  validate(s) {
    if (s == null || s == 'null')
      return '';
    else
      return s;
  }

}
