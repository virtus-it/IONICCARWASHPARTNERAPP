import {Component} from '@angular/core';
import {App, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {AbstractPage} from "../../../abstract/abstract";
import {APP_TYPE, KEY_USER_INFO, RES_SUCCESS, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";
import {TranslateService} from "@ngx-translate/core";



@IonicPage()
@Component({
  selector: 'page-notifications-list',
  templateUrl: 'notifications-list.html',
})
export class NotificationsListPage extends AbstractPage {

  dateTo: any;
  dateFrom: any;

  searchType: string = 'allcustomers';
  searchText: string = '';
  isPagingEnabled:boolean = true;
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

            this.fetch();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO;
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

  fetch(paging?) {

    try {
      if(!this.event)
        this.presentLoading();

      /*{"User":{"user_type":"dealer","transtype":"getsms",
      "loginid":1,"lastid":0,"apptype":"carwash","pagesize":100}}*/

      let input = {
        "User": {
          transtype: 'getsms',
          user_type: UtilsProvider.USER_TYPE,
          loginid: UtilsProvider.USER_ID,
          pagesize:50,
          "apptype": APP_TYPE
        }
      };

      if (paging) {
        this.isPaging = true;
        input.User["lastid"] = this.listOf[this.listOf.length - 1].id;
      } else {
        this.isPaging = false;
        input.User["lastid"] = '0';
      }

      this.alertUtils.showLog(input);
      this.postWebservice('get', this.apiService.createSms(), JSON.stringify(input));
    } catch (e) {
    }
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
    if (this.event) {
      this.alertUtils.showLog(this.event);
      this.event.complete();
    }
  }

  validate(s) {
    return this.alertUtils.validate(s);
  }

  goToSendPage(){
    this.navCtrl.push('SendNotificationsPage');
  }

  webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':

        if(!this.isPaging)
          this.listOf = [];

        if (json && json.result == RES_SUCCESS && json.data) {
          this.isPagingEnabled = true;
          for (let i = 0; i < json.data.length; i++) {
            let obj = json.data[i];
            this.listOf.push(obj);
          }
        } else{
          this.isPagingEnabled = false;
        }
        this.closeRefresherInfinite();
        break;

      default:
        alert("Something went wrong.");
        break;
    }
  }

  handleError(json, reqId) {
  }

}
