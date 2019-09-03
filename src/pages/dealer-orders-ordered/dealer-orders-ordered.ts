import {Component} from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerOrderDetailsPage} from "../dealer-order-details/dealer-order-details";


@IonicPage()
@Component({
  selector: 'page-dealer-orders-ordered',
  templateUrl: 'dealer-orders-ordered.html',
})
export class DealerOrdersOrderedPage {

  public static statusUpdated = false;
  showProgress = true;
  searchInput = {
    "userid": UtilsProvider.USER_ID,
    "status": "globalsearch",
    "pagesize": "10",
    "last_orderid": "117",
    "searchtext": "",
    "searchtype": "name",
    "searchfor": "order",
    "apptype": APP_TYPE
  };
  private response: any;
  private noRecords = false;

  ionViewWillEnter(){
    this.alertUtils.showLog('ionViewWillEnter');

    this.alertUtils.showLog('ngOnInit');
    if(UtilsProvider.ORDER_STUAS_UPDATED){
      UtilsProvider.ORDER_STUAS_UPDATED = false;
      this.initLoad();
    }
  }
  ionViewDidLoad(){
    this.alertUtils.showLog('ionViewDidLoad');
  }

  ionViewDidEnter(){
    this.alertUtils.showLog('ionViewDidEnter');
  }

  ionViewWillLeave(){
    this.alertUtils.showLog('ionViewWillLeave');
  }

  ionViewDidLeave(){
    this.alertUtils.showLog('ionViewDidLeave');
  }

  ionViewWillUnload(){
    this.alertUtils.showLog('ionViewWillUnload');
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private  apiService: ApiProvider,
              private platform: Platform,
              private modalCtrl: ModalController,
              private appCtrl: App) {

    this.alertUtils.showLog('constructor');

    this.initLoad();
  }

  initLoad(){
    this.showProgress = false;
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


  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "status": 'pending',
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
        this.alertUtils.showLog("POST (SUCCESS)=> ORDERS: ORDERED : ");
        this.alertUtils.showLog(res);

        this.processData(res, isPaging);
      }, error => {
        this.alertUtils.hideLoading();
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      });


    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    }
  }

  processData(res, isPaging) {
    try {
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.noRecords = false;

        if (!isPaging)
          this.response = res.data;
        for (let i = 0; i < res.data.length; i++) {


          if (res.data[i].status == OrderTypes.ORDERED ||
            res.data[i].status == OrderTypes.ASSIGNED ||
            res.data[i].status == OrderTypes.ACCEPT ||
            res.data[i].status == OrderTypes.ORDER_STARTED ||
            res.data[i].status == OrderTypes.JOB_STARTED ||
            res.data[i].status == OrderTypes.BACKTODEALER ||
            res.data[i].status == OrderTypes.NOT_BROADCASTED) {

            res.data[i]["orderstatus"] = "ASSIGN";

            if (res.data[i].status == OrderTypes.ORDERED ||
              res.data[i].status == OrderTypes.BACKTODEALER ||
              res.data[i].status == OrderTypes.NOT_BROADCASTED)
              res.data[i]["statusUpdated"] = "Job Created";
            else if (res.data[i].status == OrderTypes.ASSIGNED)
              res.data[i]["statusUpdated"] = "Assigned to Service Agent";
            else if (res.data[i].status == OrderTypes.ACCEPT)
              res.data[i]["statusUpdated"] = "Job Accepted";
            else if (res.data[i].status == OrderTypes.ORDER_STARTED)
              res.data[i]["statusUpdated"] = "Engineer started from his loc";
            else if (res.data[i].status == OrderTypes.JOB_STARTED)
              res.data[i]["statusUpdated"] = "Job Started";
          } else if (res.data[i].status == OrderTypes.DELIVERED) {
            res.data[i]["orderstatus"] = "DELIVERED";
            res.data[i]["statusUpdated"] = "Job Completed";
          }else if (res.data[i].status == OrderTypes.JOB_COMPLETED) {
            res.data[i]["orderstatus"] = "jobcompleted";
            res.data[i]["statusUpdated"] = "Payment Pending";
          }
          else if (res.data[i].status == OrderTypes.CANNOT_DELIVER) {
            res.data[i]["orderstatus"] = "CANT DELIVER";
          } else if (res.data[i].status == OrderTypes.DOORLOCK) {
            res.data[i]["orderstatus"] = "DOORLOCK";
          } else if (res.data[i].status == OrderTypes.NOT_REACHABLE) {
            res.data[i]["orderstatus"] = "NOT REACHABLE";
          } else if (res.data[i].status == OrderTypes.CANCELLED) {
            res.data[i]["orderstatus"] = "CANCELLED";
            res.data[i]["statusUpdated"] = "Job Cancelled";
          } else if (res.data[i].status == OrderTypes.ONHOLD) {
            res.data[i]["orderstatus"] = "ON HOLD";
            res.data[i]["statusUpdated"] = "Job is On Hold";
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
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  search(event) {

    try {
      if(!this.searchInput.searchtext){
        this.alertUtils.showToast("Please type "+ this.searchInput.searchtype);
        return false;
      }
      let input = {
        "order": this.searchInput
      };

      let data = JSON.stringify(input);
      this.showProgress = true;
      this.apiService.postReq(this.apiService.searchOrders(), data).then((res) => {
        this.showProgress = false;

        this.alertUtils.showLog(res);
        this.alertUtils.showLog(JSON.stringify(res));

        this.processData(res, false);

      }, (error) => {

      })
    } catch (e) {
      this.alertUtils.showLog(e);
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

  /*viewDetails(event, orderID, categoryID) {
    if (orderID) {
      this.appCtrl.getRootNav().push('DealerOrderDetailsPage', {
        orderid: orderID,
        categoryid: categoryID,
        callFrom:'ordered',
      });
    }
  }*/

  viewDetails(event, orderID, categoryID) {
    let model = this.modalCtrl.create('DealerOrderDetailsPage', {
      orderid: orderID,
      categoryid: categoryID,
      callFrom:'ordered',
    })

    model.onDidDismiss(data => {
      this.alertUtils.showLog('onDidDismiss');
      this.alertUtils.showLog('value : '+ UtilsProvider.ORDER_STUAS_UPDATED);
      if(UtilsProvider.ORDER_STUAS_UPDATED){
        UtilsProvider.ORDER_STUAS_UPDATED = false;
        this.fetchOrders(false,false,false,true,true);
      }
    })
    model.present();
  }

}
