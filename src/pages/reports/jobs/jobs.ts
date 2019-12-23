import {Component} from '@angular/core';
import {App, IonicPage, LoadingController, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {AbstractPage} from "../../../abstract/abstract";
import {
  APP_TYPE,
  KEY_USER_INFO,
  OrderTypes,
  RES_SUCCESS,
  UtilsProvider
} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";

@IonicPage()
@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage extends AbstractPage {

  public static statusUpdated = false;
  isPagingEnabled: boolean = true;
  dateTo: any;
  dateFrom: any;
  searchType: string = 'status';
  searchText: string = 'delivered';
  private listOf: any;

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
    if(this.searchType == 'serviceagent' || this.searchType == 'customername' || this.searchType == 'jobid' || this.searchType == 'vendor')
      this.searchText = '';
  }

  fetch(paging?) {

    if (!this.event)
      this.presentLoading();

    // sample input
    /*{"transtype":"jobfilter","searchtype":"status","searchtext":"delivered", "lastid":"0","pagesize":"10"}}*/

    // Input construction
    let input = {
      "root": {
        'transtype': 'jobfilter',
        'searchtype': this.searchType,
        'searchtext': this.searchText,
        "userid": UtilsProvider.USER_ID,
        "pagesize": '10',
        "apptype": APP_TYPE
      }
    };

    // validation for date
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


  processData(res) {
    try {
      if (res.result == this.alertUtils.RESULT_SUCCESS && res.data) {

        if (!this.isPaging)
          this.listOf =[];

        this.isPagingEnabled = true;

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
          } else if (res.data[i].status == OrderTypes.JOB_COMPLETED) {
            res.data[i]["orderstatus"] = "jobcompleted";
            res.data[i]["statusUpdated"] = "Payment Pending";
          } else if (res.data[i].status == OrderTypes.ARRIVED) {
            res.data[i]["orderstatus"] = "Arrived";
            res.data[i]["statusUpdated"] = "Service Agent at Customer loc";
          } else if (res.data[i].status == OrderTypes.CANNOT_DELIVER) {
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

            this.listOf.push(res.data[i]);
        }

      } else {
        if (!this.isPaging)
          this.listOf = [];

        this.isPagingEnabled = false;
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    } finally {
      this.closeRefresherInfinite();
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

  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':
        this.processData(json);
        break;


      case 'update_wallet':

        if (json && json.result == RES_SUCCESS && json.data) {
          this.alertUtils.showToast(json.data.type + ' ' + json.data.message);
        } else {
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
