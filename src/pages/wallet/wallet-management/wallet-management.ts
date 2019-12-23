import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform
} from "ionic-angular";
import {APP_TYPE, KEY_USER_INFO, RES_SUCCESS, UserType, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {AbstractPage} from "../../../abstract/abstract";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-wallet-management',
  templateUrl: 'wallet-management.html',
})
export class WalletManagementPage extends AbstractPage{

  isUpdate: any = false;
  imgUrl: any;
  listOf: any;
  agents: any = [];
  selectedAgentName: any;
  selectedAgentObj: any;
  isPagingEnabled:boolean = true;
  userType:any;
  userTypes: typeof  UserType = UserType;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private apiService: ApiProvider,
              private platform: Platform,
              private alertUtils: UtilsProvider,
              public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
    super(loadingCtrl, webservice);
    try {
      this.platform.ready().then(ready => {
        let lang = "en";
        if (UtilsProvider.lang) {
          lang = UtilsProvider.lang
        }

        this.translateService.use(lang);

        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);
            this.userType = UtilsProvider.USER_TYPE;

            if(this.userType == this.userTypes.SUPPLIER){
              this.selectedAgentObj= value;
              this.fetch();
            }else{
              //initial call
              this.fetchAgent();
            }

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);
            this.userType = UtilsProvider.USER_TYPE;

            if(this.userType == this.userTypes.SUPPLIER){
              this.selectedAgentObj= value;
                this.fetch();
            }else{
              //initial call
              this.fetchAgent();
            }

          }
        });

      });

    } catch (e) {
      this.alertUtils.showLog(e);
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

  fetch(paging?) {

    if(!this.event)
      this.presentLoading();

    //this.storage.getObject(USER_INFO).then((val) => {

      // {"root":{"transtype":"getcustomers","userid":"1","apptype":"carservice"}}

      let input = {
        "root": {
          "transtype": 'getwallethistory',
          "userid": this.selectedAgentObj.userid,
          "apptype": APP_TYPE,
          "pagesize":"10"
        }
      };

      if (paging) {
        this.isPaging = true;
        input.root["lastid"] = this.listOf[this.listOf.length - 1].id;
      } else {
        this.isPaging = false;
        input.root["lastid"] = '0';
      }

      this.postWebservice('get', this.apiService.walletManagement(), JSON.stringify(input));

    //});
  }



  fetchAgent() {

    this.presentLoading();

    try {

      let url = this.apiService.getSuppliers() + UtilsProvider.USER_ID + "/" + APP_TYPE + "/" + UtilsProvider.USER_TYPE;


      this.apiService.getReq(url).then(res => {
        this.closeLoading();
        this.alertUtils.showLog(res.data);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {

          for (let i = 0; i < res.data.length; i++) {

            if(res.data[i].availability == 1)
              res.data[i]['activeStatus'] = true;
            else
              res.data[i]['activeStatus'] = false;

            this.agents.push(res.data[i]);
          }
        } else {
          this.agents = [];
        }

      }, error => {
        this.agents = [];
      })

    } catch (e) {
    }
  }

  updateAgent(event,agent){
    this.selectedAgentObj = agent;
    this.fetch();
  }

  validate(s){
    return this.alertUtils.validate(s);
  }

  updatePaymentType(s){
    if(s){
      if(s == 'cash' || s == 'cod')
        return 'COD';
      else if(s == 'online payment')
        return 'Online payment';
      else
        return  s;
    }
  }

  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':

        if(!this.isPaging)
          this.listOf = [];

        if(json && json.result == RES_SUCCESS && json.data){
          this.isPagingEnabled = true;

          for (let i = 0; i < json.data.length; i++) {
            const obj = json.data[i];
            if (obj.paymenttype) {
              if(obj.paymenttype == 'cash' || obj.paymenttype == 'cod')
                obj["paymenttype"] = 'cod';
            }

            obj['orderamt']     = obj.orderamt    ? (obj.orderamt == 'null'     ? '0' : obj.orderamt)     : '0';
            obj['platformfee']  = obj.platformfee ? (obj.platformfee == 'null'  ? '0' : obj.platformfee)  : '0';
            obj['totalfee']     = obj.totalfee    ? (obj.totalfee == 'null'     ? '0' : obj.totalfee)     : '0';
            obj['gatewayfee']   = obj.gatewayfee  ? (obj.gatewayfee == 'null'   ? '0' : obj.gatewayfee)   : '0';
            obj['beforeamount'] = obj.beforeamount? (obj.beforeamount == 'null' ? '0' : obj.beforeamount) : '0';
            obj['afteramount']  = obj.afteramount ? (obj.afteramount == 'null'  ? '0' : obj.afteramount)  : '0';
            obj['addedordeductedamt']  = obj.addedordeductedamt ? (obj.addedordeductedamt == 'null'  ? '0' : obj.addedordeductedamt)  : '0';

            this.listOf.push(obj);
          }
        }else{
          this.isPagingEnabled = false;
        }

        this.closeRefresherInfinite();

        this.alertUtils.showLog(this.isPagingEnabled);
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
