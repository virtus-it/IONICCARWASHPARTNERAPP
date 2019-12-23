import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {AbstractPage} from "../../../abstract/abstract";
import {APP_TYPE, KEY_USER_INFO, RES_SUCCESS, UserType, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-wallet-settlements',
  templateUrl: 'wallet-settlements.html',
})
export class WalletSettlementsPage extends AbstractPage{

  topupType:any = 'topup';
  listOf: any;
  agents: any = [];
  selectedAgentName: any;
  selectedAgentObj: any;
  isPagingEnabled:boolean = true;
  userType:any;
  userTypes: typeof  UserType = UserType;
  isSuperDealer: boolean = false;

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
            this.isSuperDealer = UtilsProvider.ISSUPER_DEALER;

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
            this.isSuperDealer = UtilsProvider.ISSUPER_DEALER;

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
        this.alertUtils.showLog(this.agents);

      }, error => {
        this.agents = [];
      })

    } catch (e) {
    }
  }

  showReconcileAlert(){
    try {

      let model = this.modalCtrl.create('ReconcilePage', {
        user: this.selectedAgentObj
      })

      model.onDidDismiss(data => {
        if (data) {
          this.alertUtils.showLog(data);
          if (data.result == this.alertUtils.RESULT_SUCCESS) {
            this.alertUtils.showToast(data.data.type+' '+data.data.message);
            this.fetch();
          } else {
            this.alertUtils.showToast('Some thing went wrong!');
          }
        }
      })
      model.present();
    } catch (e) {
    }
  }

  showAlert(type){
    if(this.selectedAgentObj){

      let title = 'Wallet top up';
      let placeHolder = 'Top up amount';

      if(type == '1'){
        this.topupType = 'topup';
        title = 'Wallet top up';
        placeHolder = 'Top up amount';
      }else{
        this.topupType = 'reconcile';
        title = 'Wallet reconcile';
        placeHolder = 'Reconcile amount';
      }

      let prompt = this.alertCtrl.create({
        title: title,
        inputs : [
          {
            type:'number',
            label:'amount',
            placeholder: placeHolder
          }],
        buttons : [
          {
            text: "Cancel",
            handler: data => {
            }
          },
          {
            text: "Update wallet",
            handler: data => {

              this.alertUtils.showLog(data);

              if(data[0]){
                this.updateWallet(data[0]);
              }else
                this.alertUtils.showToast('Amount required');
              /*let input = {
                "product": {
                  //"TransType": 'deactivate',
                  "pid": user.productid,
                  "userid": this.USER_ID,
                  "loginid": this.USER_ID,
                  "user_type": UserType.DEALER,
                  "app_type": APP_TYPE
                }
              };*/
            }
          }]});
      prompt.present();
    }else
      this.alertUtils.showToast('Please select service agent');

  }

  updateWallet(amt) {

    this.presentLoading();

    //{"root":{"type":"topup","userid":"33","loginid":"1"}}

    let input = {
      "root": {
        'type': this.topupType,
        "amount"    : amt,
        "userid"    : this.selectedAgentObj.userid,
        "loginid"    : UtilsProvider.USER_ID,
        "apptype"   : APP_TYPE
      }
    };


    this.postWebservice('update_wallet', this.apiService.walletManagement(), JSON.stringify(input));

  }

  updateAgent(agent){
    this.selectedAgentObj = agent;
    this.alertUtils.showLog(this.selectedAgentObj);
    this.fetch();
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
        "transtype":'getpaymenthistory',
        "userid"    : this.selectedAgentObj.userid,
        "loginid"    : UtilsProvider.USER_ID,
        "apptype"   : APP_TYPE,
        "pagesize"  :"10"
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

  validate(s){
    return this.alertUtils.validate(s);
  }

  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'get':

        if(!this.isPaging)
          this.listOf = [];

        if(json && json.result == RES_SUCCESS && json.data){
          this.isPagingEnabled = true;

          //if(json.data.history) {
            for (let i = 0; i < json.data.length; i++) {
              const obj = json.data[i];

              obj['amount'] = obj.amount ? (obj.amount == 'null' ? '0' : obj.amount) : '0';
              obj['floating_cash'] = obj.floating_cash ? (obj.floating_cash == 'null' ? '0' : obj.floating_cash) : '0';
              obj['presentwalletamount'] = obj.presentwalletamount ? (obj.presentwalletamount == 'null' ? '0' : obj.presentwalletamount) : '0';

              this.listOf.push(obj);
            }
          //}

          /*if(json.data.bankdetails) {
            for (let i = 0; i < json.data.bankdetails.length; i++) {
              const obj = json.data.bankdetails[i];
              this.bankDetails.push(obj);
            }
          }*/
        }else{
          this.isPagingEnabled = false;
        }

        this.closeRefresherInfinite();
        break;

      case 'update_wallet':

        if(json && json.result == RES_SUCCESS && json.data){
          this.alertUtils.showToast(json.data.type+' '+json.data.message);
          this.fetch();
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
