import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";
import {DealerStockNotificationsConfirmStockPage} from "../dealer-stock-notifications-confirm-stock/dealer-stock-notifications-confirm-stock";

@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-all',
  templateUrl: 'dealer-stock-notifications-all.html',
})
export class DealerStockNotificationsAllPage {

  IS_PAGING: boolean = false;
  IS_REFRESH: boolean = false;
  showProgress = true;
  private response: any = [];
  private noRecords = false;
  from:string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private network: NetworkProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private modalCtrl: ModalController) {

    try {
      this.from = this.navParams.get('from');
    }catch (e) {
      this.from = '';
    }


    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false,false,true,"","");
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false,false,true,"","");
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
            "status": 'all',
            "dealerid": UtilsProvider.USER_DEALER_ID,
            "pid": '0',
            "pagesize": '10',
            "framework": FRAMEWORK,
            "apptype": APP_TYPE
          }
        };
      }


      if (isPaging) {
        input.root["lastid"] = this.response[this.response.length - 1].reqid;
      } else {
        input.root["lastid"] = '0';
      }

      let data = JSON.stringify(input);

      this.alertUtils.showLog('data : '+data);

      this.apiService.postReq(this.apiService.getStockRequests(), data).then(res => {
        this.hideProgress(isFrist,isRefresh,isPaging,paging, refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> STOCK: ALL : " + JSON.stringify(res));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          /*if (!isPaging)
            this.response = res.data;*/
          for (let i = 0; i < res.data.length; i++) {

            if(res.data[i].products) {
              if (isPaging)
                this.response.push(res.data[i]);
              else
                this.response.push(res.data[i]);
            }
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

  viewDetails($event,req){
    if(req){
      let model = this.modalCtrl.create('DealerStockNotificationsConfirmStockPage', {
        req:req,
        status:req.status,
      },{
        cssClass: 'dialogcustomstyle',
      })
      model.present();

      model.onDidDismiss(data => {
        if (data && data.hasOwnProperty('result')) {
          if (data.result == this.alertUtils.RESULT_SUCCESS) {
              this.alertUtils.showToast('Updated successfully');

            this.fetchOrders(false,false,false,'','');

          } else {
            this.alertUtils.showToast('Some thing went wrong!');
          }
        }
      })
    }
  }
}
