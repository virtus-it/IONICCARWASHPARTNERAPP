import { Component } from '@angular/core';
import {App, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {AbstractPage} from "../../../abstract/abstract";
import {APP_TYPE, KEY_USER_INFO, OrderTypes, RES_SUCCESS, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";

@IonicPage()
@Component({
  selector: 'page-payments',
  templateUrl: 'payments.html',
})
export class PaymentsPage extends AbstractPage{

  public static statusUpdated = false;
  isPagingEnabled:boolean = true;
  private listOf: any = [];

  searchType:string = 'paymenttype';
  searchText:string = 'cod';
  dateTo  : any;
  dateFrom: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private  apiService: ApiProvider,
              private platform: Platform,
              private modalCtrl: ModalController,
              private appCtrl: App,
              public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider,
              private translateService: TranslateService) {

    super(loadingCtrl, webservice);

    let lang = "en";
    if (UtilsProvider.lang) {
      lang = UtilsProvider.lang
    }
    UtilsProvider.sLog(lang);
    translateService.use(lang);
    this.alertUtils.showLog('constructor');

    this.initLoad();
  }

  initLoad(){
    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.fetch();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.fetch();
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  selected(){
    if(this.searchType == 'vendor' || this.searchType == 'serviceagent' || this.searchType == 'jobid')
      this.searchText = '';
  }

  updatePaymentType(s){
    if(s){
      if(s == 'cash' || s == 'cod')
        return 'cod';
      else if(s == 'card payment')
        return  'card';
      else
        return s;
    }else
      return '';
  }

  fetch(paging?){

    if(!this.event)
      this.presentLoading();

    //{"transtype":"jobfilter","searchtype":"status","searchtext":"delivered",
    // "lastid":"0","pagesize":"10"}}

    let input = {
      "root": {
        'transtype': 'paymentfilter',
        'searchtype': this.searchType,
        'searchtext': this.searchText,
        "userid": UtilsProvider.USER_ID,
        "pagesize": '10',
        "apptype": APP_TYPE
      }
    };

    let executeApiCall = false;
    if (this.searchType == 'date') {
      if (this.dateFrom) {
        if (this.dateTo) {
          executeApiCall = true;
          input.root["datefrom"] = this.dateFrom;
          input.root["dateto"] = this.dateTo;
          input.root["searchtext"] = null;
        } else
          this.alertUtils.showToast('To date required');
      } else
        this.alertUtils.showToast('From date required');
    }else
      executeApiCall = true;

    // paging
    if (paging) {
      this.isPaging = true;
      input.root["lastid"] = this.listOf[this.listOf.length - 1].orderid;
    } else {
      this.isPaging = false;
      input.root["lastid"] = '0';
    }

    // api call

    if (executeApiCall) {
      this.postWebservice('get', this.apiService.reports(), JSON.stringify(input));
    }else{
      this.closeRefresherInfinite();
    }
  }

  validate(s){
    return this.alertUtils.validate(s);
  }

  validatePaymentType(s){
    s = this.alertUtils.validate(s);
    if(s == 'cash' || s == 'cod')
      return 'cod';
    else
      return s;
  }

  doRefresh(refresher) {
    this.event = refresher;
    this.fetch();

    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    this.event = paging;
    if (this.listOf) {
      if (this.listOf.length > 0) {
        this.fetch(paging);
      }
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

  closeRefresherInfinite(){
    this.closeLoading();

    if (this.event) {
      this.alertUtils.showLog(this.event);
      this.event.complete();
    }
  }


  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':

        if(!this.isPaging)
          this.listOf = [];

        if (json.result == this.alertUtils.RESULT_SUCCESS && json.data) {
          this.isPagingEnabled = true;

          for(let i=0;i<json.data.length; i++){
            let obj = json.data[i];
            if (obj.paymentstatus == 'confirm') {
              obj['paymentstatus'] = "Payment Confirmed"
            }else if(obj.paymentstatus == 'rejected'){
              obj['paymentstatus'] = "Payment Rejected"
            }else if(obj.paymentstatus == 'received'){
              obj['paymentstatus'] = "Payment Received"
            }
            this.listOf.push(obj);
          }
        }else {
          if(!this.isPaging)
            this.listOf = [];
          this.isPagingEnabled = false;
        }
        this.closeRefresherInfinite();

        break;


      case 'update_wallet':

        if(json && json.result == RES_SUCCESS && json.data){
          this.alertUtils.showToast(json.data.type+' '+json.data.message);
        }else{
          this.isPagingEnabled = false;
          this.alertUtils.showToast('Something went wrong.');
        }

        break;

      default:
        alert("Something went wrong.")
        break;
    }
  }

  protected handleError(json, reqId) {
  }

}
