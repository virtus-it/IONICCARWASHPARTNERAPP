import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import * as moment from 'moment';
import {TranslateService} from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-sms-reports',
  templateUrl: 'sms-reports.html',
})
export class SmsReportsPage {

  showProgress = false;
  private response: any;
  private noRecords = false;
  private USER_ID ;
  private USER_TYPE;
  yearMinLimit: any;
  yearMaxLimit: any;
  fromDate:any;
  toDate:any;
  private isDealer: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {


    try {
      this.platform.ready().then(ready => {
        let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
           // this.getAll(false, false, true, "", "");
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            //this.getAll(false, false, true, "", "");
          }
        });
      });

      if(UtilsProvider.ISSUPER_DEALER){
        this.isDealer = true;
      }else{
        this.isDealer = false;
      }

    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  ionViewDidLoad() {
    var now = moment();
    var old = moment().add(-1, 'years');
    this.yearMinLimit = moment(old.format(), moment.ISO_8601).format();
    this.yearMaxLimit = moment(now.format(), moment.ISO_8601).format();
  }

  getReports(){

    //initial call
    this.getAll(false, false, true, "", "");
  }

  getAll(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let canIExecute = false;

      let fDate, tDate;
      if(this.fromDate){
        fDate = UtilsProvider.formatDateToYYYYMMDD(this.fromDate);
        fDate = fDate.concat(' 00:00:00');

        if(this.toDate){
          tDate = UtilsProvider.formatDateToYYYYMMDD(this.toDate);
          tDate = tDate.concat(' 00:00:00');
          canIExecute = true;
        }else
          this.alertUtils.showToast('to date required');
      }else
        this.alertUtils.showToast('from date required');


      if(canIExecute){
        let input = {
          "User": {
            "user_type": UserType.DEALER,
            "transtype": 'get',
            "loginid": this.USER_ID,
            "from": fDate,
            "to":   tDate,
            "framework": FRAMEWORK,
            "apptype": APP_TYPE
          }
        };

        let data = JSON.stringify(input);

        this.showProgress = true;
        this.apiService.postReq(this.apiService.getSmsList(), data).then(res => {
          this.showProgress = false;

          if(res.result == 'success'){
            this.alertUtils.showLog(res.data);
            this.alertUtils.showLog(res.data[0].mobilenumbers);

            if(res && res.data)
              this.response = res.data;
            this.noRecords = false;

            this.alertUtils.showLog('res : '+this.response);
          }
        }, error => {

        })
      }

    } catch (e) {
      //this.alertUtils.hideLoading();
      //this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    }
  }

  sendTo(numbers){

    let s ='';
    try {
      numbers = JSON.parse(numbers);
      for (let i = 0; numbers.length > i; i++) {
        if (i == 0)
          s = numbers[i].mobileno;
        else
          s = s + ', ' + numbers[i].mobileno;
      }
    } catch (e) {
    }
    return s;
  }

  validate(s){
    if(s){
      if(s == null || s == 'null')
        return '';
      else
        return s;
    }else
      return '';
  }

  formatDate(s){
    return UtilsProvider.formatDate(s);
  }

  statusUpdate(s){
    if(s=='1')
      return 'Sent';
    else
      return 'Not sent';
  }

  doRefresh(refresher) {
   // this.getAll(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      /*if (this.response.length > 0)
        this.getAll(true, false, false, paging, "");
      else
        paging.complete();*/
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
}
