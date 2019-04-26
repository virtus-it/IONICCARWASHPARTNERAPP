import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  MOBILE_TYPE,
  RES_SUCCESS,
  UserType,
  UtilsProvider
} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  private showProgress = false;
  private showScreen = false;
  private noInternet: boolean = false;
  private showLoading: boolean = true;
  private userID = "0";
  private dealerID = "0";
  private verCode = "6";
  private deviceCode: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertUtils: UtilsProvider,
              public apiService: ApiProvider,
              public platform: Platform) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.platform.ready().then(ready => {
      try {
        this.alertUtils.getVersionCode().then(code => {
          this.deviceCode = code;
        }).catch(reason => {
          this.alertUtils.showLog(reason);
        });

        this.userID = UtilsProvider.USER_ID;
        this.dealerID = UtilsProvider.USER_DEALER_ID;

        this.appFirstCall();

      } catch (e) {
        this.showScreen = true;
        this.alertUtils.showLog(e);
      }
    });


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  loadLoginPage() {
    this.navCtrl.push('LoginPage');
  }

  loadSignUpPage() {
    this.navCtrl.push('RegisterPage');
  }

  appFirstCall() {
    if (this.alertUtils.networkStatus()) {
      this.noInternet = false;
      this.appFirstCallTask();
    } else {
      this.noInternet = true;
      this.showLoading = false;
      this.showScreen = false;
    }
  }

  appFirstCallTask() {

    try {
      if (!this.userID) {
        this.userID = "0"
      }
      if (!this.dealerID) {
        this.dealerID = "0"
      }
      let input =
        {
          "root": {
            "userid": this.userID,
            "dealerid": this.dealerID,
            "usertype": APP_USER_TYPE,
            "appusertype": APP_USER_TYPE,
            "apptype": APP_TYPE,
            "mobiletype": MOBILE_TYPE,
            "framework": FRAMEWORK
          }
        };
      if (this.deviceCode) {
        input.root["versionnumber"] = this.deviceCode;
      }
      if (this.alertUtils.getGcmId()) {
        input.root["usergcmid"] = this.alertUtils.getGcmId();
      }

      if (this.alertUtils.getDeviceUUID()) {
        input.root["useruniqueid"] = this.alertUtils.getDeviceUUID();
      }

      let data = JSON.stringify(input);
      this.showLoading = true;

      this.apiService.postReq(this.apiService.getAppFirstCall(), data)
        .then(res => {
          if (res.result == RES_SUCCESS) {
            if (res.data) {
              this.alertUtils.showLog(res.data.appversion);
              let apiV = parseInt(res.data.appversion);
              let appV = parseInt(this.verCode);
              this.alertUtils.showLog(apiV);
              this.alertUtils.showLog(appV);

              if (apiV < appV) {
                if (res.data.userdetails) {


                }
                this.moveToNextScreen();
              } else {
                //this.showConfirm();
              }
            }
          }
        }, error => {

        })

    } catch (error) {
      this.showLoading = false;
      this.noInternet = false;
      this.alertUtils.showLog(2);
      this.showScreen = true;
      this.alertUtils.showLog(error);
    }
  }

  moveToNextScreen() {
    let uType, output;
    output = this.alertUtils.getUserInfo();
    uType = output.USERTYPE;

    if (output != null) {
      if (uType == UserType.DEALER || uType == UserType.CUSTOMER_CARE) {
        if ((uType == UserType.DEALER && output.issuperdealer == 'true')
          || uType == UserType.CUSTOMER_CARE)
          this.navCtrl.setRoot('DealerOrdersHomePage');
        else {
          //vendor login - no need show Orders pages
          this.navCtrl.setRoot('DealerSuppliersPage', {from: 'loginPage'});
        }
      } else if (uType == UserType.SUPPLIER) {
        this.navCtrl.setRoot('SupplierOrdersHomePage');
      }
    } else
      this.loadLoginPage();
  }

}
