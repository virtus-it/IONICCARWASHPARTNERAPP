import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, KEY_USER_INFO, RES_SUCCESS, UtilsProvider} from "../../../providers/utils/utils";
import {ApiProvider} from "../../../providers/api/api";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {AbstractPage} from "../../../abstract/abstract";
import {CallWebserviceProvider} from "../../../providers/call-webservice/call-webservice";

@IonicPage()
@Component({
  selector: 'page-reconcile',
  templateUrl: 'reconcile.html',
})
export class ReconcilePage extends AbstractPage {

  amt: any;
  user: any;
  selected: any;
  selectedBank: any = {};
  bankDetails = [];


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider,
              private formBuilder: FormBuilder,
              private translateService: TranslateService) {
    super(loadingCtrl, webservice);
    let lang = "en";
    if (UtilsProvider.lang) {
      lang = UtilsProvider.lang
    }
    UtilsProvider.sLog(lang);
    translateService.use(lang);

    this.user = navParams.get('user');

    this.alertUtils.showLog(this.user);

    if (this.user &&
      this.user.associateddealer &&
      this.user.associateddealer.bankdetails &&
      this.user.associateddealer.bankdetails.length > 0) {
      this.selectedBank = this.user.associateddealer.bankdetails[0];
      this.selected = this.user.associateddealer.bankdetails[0].name;
      this.bankDetails = this.user.associateddealer.bankdetails;
    }

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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  updateBankDetails(bank) {
    this.selectedBank = bank;
  }

  updateWallet() {


    if (this.amt) {

      this.presentLoading();

      //{"root":{"type":"topup","userid":"33","loginid":"1"}}

      let input = {
        "root": {
          'type': 'reconcile',
          "amount": this.amt,
          "bankname": this.selectedBank.name ? this.selectedBank.name : null,
          "bankifsc": this.selectedBank.ifsc ? this.selectedBank.ifsc : 0,
          "accnumber": this.selectedBank.number ? this.selectedBank.number : 0,
          "userid": this.user.userid,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE
        }
      };


      this.postWebservice('update_wallet', this.apiService.walletManagement(), JSON.stringify(input));
    } else
      this.alertUtils.showToast('amount required');
  }

  validate(s) {
    return this.alertUtils.validate(s);
  }

  protected webCallback(json, api, reqId) {
    this.closeLoading();
    switch (reqId) {
      case 'update_wallet':

        if (json && json.result == RES_SUCCESS && json.data) {
          this.viewCtrl.dismiss(json);
        } else {
          this.alertUtils.showToast('Something went wrong.');
        }

        break;


      default:
        alert("Something went wrong.");
        break;
    }
  }

  protected handleError(json, reqId) {
  }

}
