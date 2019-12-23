import {Component} from '@angular/core';
import {App, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {AbstractPage} from "../../../abstract/abstract";
import {APP_TYPE, KEY_USER_INFO, RES_SUCCESS, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-send-notifications',
  templateUrl: 'send-notifications.html',
})
export class SendNotificationsPage extends AbstractPage {

  dateTo: any;
  dateFrom: any;
  message: any;
  mestype: any = 'sms';
  searchType: string = 'allcustomers';
  searchText: string = '';
  checkAll: boolean = false;
  checkAllMobile: boolean = false;
  showOptions: boolean = false;
  mobileDetails: any = [];
  smsInput: any = [];
  private listOf: any = [];

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

  initLoad() {
    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO;
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  validateFilter() {
    if (this.message) {
      if (this.searchType == 'customerswitharea' || this.searchType == 'serviceagentwitharea') {
        if (this.searchText) {
          this.getList();
        } else
          this.alertUtils.showLog('Area required');
      } else {
        this.getList();
      }
    } else
      this.alertUtils.showToast('Message required');
  }

  getList(dates?) {

    try {

      this.presentLoading();

      let input;

      /*if (dates) {

        /!*{"User":{"transtype":"activecustomers","fromdate":"2019-05-11",
        "todate":"2019-10-01","lastid":"0","pagesize":"10"}}*!/

        input = {
          "root": {
            'transtype': this.searchType,
            'fromdate': this.dateFrom,
            'todate': this.dateTo,
            "userid": '1',
            "apptype": APP_TYPE
          }
        };
      } else {*/
      /*{"User":{"transtype":"customerswitharea","areaname":"shaikpet",
      "lastid":"0","pagesize":"10"}}*/
      input = {
        "root": {
          'transtype': this.searchType,
          'areaname': this.searchText ? this.searchText : null,
          "userid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE
        }
      };
      //}

      this.alertUtils.showLog(input);
      this.postWebservice('getList', this.apiService.getMobile(), JSON.stringify(input));
    } catch (e) {
    }
  }

  sendMes() {

    this.presentLoading();

    /* {"User":{"mobilenumber":[{"mobileno":"507802574"},{"mobileno":"556767777"},
    {"mobileno":"000088888"}],"count":3,"smstype":"sms","transtype":"createsms",
    "body":"hello","loginid":"1","apptype":"carwash"}}*/

    let input = {
      "User": {
        mobilenumber: this.listOf,
        count: this.listOf.length,
        smstype: this.mestype,
        transtype: 'createsms',
        body: this.message,
        loginid: '1',
        "apptype": APP_TYPE
      }
    };

    this.alertUtils.showLog(input);
    this.postWebservice('sendMes', this.apiService.createSms(), JSON.stringify(input));
  }

  /* onChangeCheck(entry: any, event) {

     try {
       let isChecked = event.checked;

       if(!this.checkAllMobile){
         if (isChecked) {
           this.smsInput.push(entry);
         } else {
           this.checkAll = false;
           this.smsInput.splice(entry,1);
         }
       }
     } catch (e) {
     }

     this.alertUtils.showLog(this.smsInput);
   }

   onChangeCheckAll(event) {

     let isChecked = event.checked;

     if (isChecked) {
       this.smsInput = [];
       this.smsInput = this.mobileDetails;
       this.checkAllMobile = true;
     } else {
       this.smsInput = [];
       this.checkAll = false;
       this.checkAllMobile = false;
     }
   }*/

  validate(s) {
    return this.alertUtils.validate(s);
  }

  webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'getList':
        if (json && json.result == RES_SUCCESS && json.data) {
          this.listOf = json.data;
          this.showOptions = true;

          this.listOf = [];
          this.mobileDetails = [];
          this.smsInput = [];

          for (let i = 0; i < json.data.length; i++) {
            let obj = json.data[i];
            if (obj.mobileno) {
              let obj1 = {mobileno: obj.mobileno, gcm_regid: obj.gcm_regid};
              this.mobileDetails.push(obj1);
              this.listOf.push(obj1);
            }
          }

          this.sendMes();

        } else
          this.listOf = [];
        break;

      case 'sendMes':
        if (json && json.result == RES_SUCCESS && json.data) {
            this.message = '';
            this.alertUtils.showToast('Send successfully');
        } else {
          this.alertUtils.showToast('Something went wrong.');
        }
        break;


      default:
        alert("Something went wrong.");
        break;
    }
  }

  handleError(json, reqId) {
  }

}
