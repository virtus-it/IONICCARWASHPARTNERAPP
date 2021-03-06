import {Component} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  MOBILE_TYPE,
  UserType,
  UtilsProvider
} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {NetworkProvider} from "../../providers/network/network";
import {TranslateService} from "@ngx-translate/core";
import 'rxjs/add/observable/interval';
import {Observable, Subscription} from "rxjs";
import {LocationUpdatesProvider} from "../../providers/location-updates/location-updates";



@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'login.html',
})
export class LoginPage {

  //development
  username: string = '';
  password: any = '';
  timerValue: any;
  timerRunning:boolean = false;
  public type = 'password';
  public showPass = false;
  errorText: string = "";
  showLogin = true;
  sub: Subscription;
  subTimeout: Subscription
  requestedOtp: boolean = false;
  sendOtpTitle:any = 'Send OTP';
  languageSelected: any;
  languages = [{ name: "English", code: "en" }, { name: "Arabic", code: "ar" }];
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private networkProvider: NetworkProvider,
              private locationUpdates : LocationUpdatesProvider,
              private menuCtrl: MenuController,
              private alertUtils: UtilsProvider,
              private apiUrl: ApiProvider,
              private alertCtrl: AlertController,
              private apiService: ApiProvider,
              public platform: Platform,
              private translateService: TranslateService) {

/*    //supplier
    this.username = '0000222251';
    this.password = '0000222251';*/


     translateService.setDefaultLang('en');
     translateService.use('en');

    try {
      this.locationUpdates.startLocationUpdates();
      this.platform.ready().then(ready => {
        this.alertUtils.getLang().then(lang => {
          if (lang) {
            this.languageSelected = lang;
          } else {
            this.languageSelected = 'en';
          }
        }, err => {
          this.alertUtils.showLog(err);
        })

        this.alertUtils.getSecValue('secure_storage_user_info').then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);
            if (UtilsProvider.USER_TYPE != null) {
              this.moveToNextPage(UtilsProvider.USER_TYPE, value);
            }
          }
        }, (error) => {

        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
    this.alertUtils.showLog("getDLang : " + this.translateService.getDefaultLang())
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LogInPage');
    this.menuCtrl.enable(false);
  }

  logIn() {

    //this.utils.showToastSnackBar('clicked');
    if(!this.username){
      this.alertUtils.showToast("Please enter mobile number");
      return false;
    }
    if(!this.password){
      this.alertUtils.showToast("Please enter password");
      return false;
    }
    let input = {
      "User": {
        "emailid": this.username,
        "mobileno": this.username,
        "pwd": this.password,
        "useruniqueid": this.alertUtils.getDeviceUUID(),
        "apptype": APP_TYPE,
        "mobiletype": MOBILE_TYPE,
        "framework": FRAMEWORK,
        "app_user_type": APP_USER_TYPE
      }
    };

    let data = JSON.stringify(input);
    //input.User["useruniqueid"] = this.getUUID();

    this.alertUtils.showLog("data", data);

    this.alertUtils.showLoading();
    this.networkProvider.postReq(this.apiUrl.login(), data).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog("res", res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.subTimeout.unsubscribe();
        if (res.data && res.data.user) {
          let output = res.data.user;
          this.setGCMDetails(output);
          let uType = output.USERTYPE;

          if (uType == UserType.DEALER ||
            uType == UserType.SUPPLIER ||
            uType == UserType.CUSTOMER_CARE||
            uType == UserType.Job_Assigner||
            uType == UserType.Billing_Administrator) {

            //billing adminstrator  - billing
            //job assigner          - job assign, slider vendor
            //customer care         -

            UtilsProvider.setUSER_INFO(output);
            this.alertUtils.initUser(output);

            try {
              this.platform.ready().then(ready => {
                this.alertUtils.setUserInfo(output).then((success) => {
                  this.alertUtils.showLog(success);
                  this.alertUtils.showLog('User Info Updated : ' + success);
                  this.moveToNextPage(uType, output);
                }, error => {
                  this.alertUtils.showLog(error);
                  this.alertUtils.showLog('User Info Updated : ' + error);
                  this.moveToNextPage(uType, output);
                });
              });
            } catch (e) {
              this.moveToNextPage(uType, output);
              this.alertUtils.showLog(e);
            }

            //UtilsProvider.setValues(uId,uName,uPhno,uAddr,uType,uDealerId,uDealerName,uDealerPhno,uDealerAddr);


          } else {
            //show alert
            //Its Admin Application
            //please use customer application

            this.alertUtils.showToast('Its Admin application\n please use customer application');
          }

        }else{
          this.alertUtils.showToast("login failed");
        }
      } else {
        alert(JSON.stringify(res.data));
      }


    }, error => {
      this.alertUtils.showLog(error);
      this.alertUtils.hideLoading();
    })

  }

  moveToNextPage(uType: string, output: any) {
    if (uType == UserType.DEALER || uType == UserType.CUSTOMER_CARE) {
      if ((uType == UserType.DEALER && output.issuperdealer == 'true') || uType == UserType.CUSTOMER_CARE)
        this.navCtrl.setRoot('DealerOrdersHomePage',{uType:uType});
      else
        this.navCtrl.setRoot('DealerSuppliersPage', {from: 'loginPage'});
    } else if (uType == UserType.SUPPLIER) {
      this.locationUpdates.sendLoctoDb('login');
      this.navCtrl.setRoot('SupplierOrdersHomePage');
    }else if (uType == UserType.Job_Assigner) {
      this.navCtrl.setRoot('DealerOrdersHomePage',{uType:uType});
    }else if (uType == UserType.Billing_Administrator) {
      this.navCtrl.setRoot('DealerOrdersHomePage', {uType:uType});
    }
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  inputMobilecall() {
    if (this.errorText != "")
      this.errorText = "";
  }

  forgotPwd() {
    this.showPromptForPwd()
  }

  showPromptForPwd() {
    let prompt = this.alertCtrl.create({
      title: 'FORGOT PASSWORD',
      inputs: [
        {
          name: 'mobileno',
          placeholder: 'Mobile number',
          type: 'tel',
          min: 10,
          max: 10,
          value: this.username

        },

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Submit',
          handler: data => {

            if (this.alertUtils.validateNumber(data.mobileno, "Mobile Number", 10, 10)) {
              if (!this.alertUtils.isValidMobile(data.mobileno)) {
                this.forgotPwdTask(data);

              } else {
                this.alertUtils.showToast("Invalid mobile number");
                return false;
              }
            } else {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
              return false;
            }


          }
        }
      ]
    });
    prompt.present();
  }

  forgotPwdTask(data) {

    try {
      /*if (this.alertUtils.networkStatus()) {*/
      this.alertUtils.showLoading();
      this.apiService.getReq(this.apiService.getForgotPwdUrl() + data.mobileno).then(res => {
        this.alertUtils.showLog(res);
        this.alertUtils.hideLoading();
        this.startTimer();
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showAlert("Success", "Password sent to your registered phone number", "OK")
        } else {
          this.alertUtils.showAlert("Warning", "Phone number not found in database", "OK")
        }
      }, err => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(err);
      });
      /*} else {
        this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
      }*/
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  setGCMDetails(data) {
    let input = {
      "User": {
        "userid": data.userid,
        "gcm_mailid": this.username,
        "gcm_regid": UtilsProvider.getGCM_ID(),
        "gcm_name": APP_USER_TYPE,
        "apptype": APP_TYPE,
        "mobileno": this.username
      }
    };
    let gcmData = JSON.stringify(input);
    this.alertUtils.showLog('gcmData : ' + gcmData);
    this.apiService.postReq(this.apiService.setGCMRegister(), gcmData).then(gcm => {
      this.alertUtils.showLog(gcm);
      if (gcm.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.showToast("You have successfully logged in");

      } else {
        this.alertUtils.showToast("Could not register device");
      }
    }, err => {
      this.alertUtils.showToast("Could not register device");
      this.alertUtils.showLog(err);
    })
  }

  getOtp() {
    try {
      if (this.username) {
        if (this.alertUtils.validateNumber(this.username, "Mobile Number", 9, 10)) {
          if (this.alertUtils.networkStatus()) {
            this.requestedOtp = true;
            this.sendOtpTitle = 'Resend OTP';
            this.forgotPwdTask({'mobileno': this.username})
          } else {
            this.alertUtils.showAlert("INTERNET CONNECTION", 'Please check your internet connection', "OK");
          }
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast("please enter mobile number");
      }
    } catch (e) {
    }
  }
  setLanguage() {
    this.alertUtils.showLog(this.languageSelected)
    let defaultLanguage = this.translateService.getDefaultLang();
    this.alertUtils.showLog("defaultLanguage : " + defaultLanguage);
    if (this.languageSelected) {
      this.translateService.setDefaultLang(this.languageSelected);
      this.translateService.use(this.languageSelected);
      this.alertUtils.setLang(this.languageSelected);
      UtilsProvider.lang = this.languageSelected;
    } else {
      this.languageSelected = defaultLanguage;
      this.translateService.use(defaultLanguage);
      this.alertUtils.setLang(defaultLanguage);
      UtilsProvider.lang = defaultLanguage;

    }
  }
  startTimer() {
    this.timerRunning = true;
    var timer = 90;
    var minutes;
    var seconds;

    this.subTimeout = Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      this.timerValue = minutes + ':' +seconds;
      --timer;
      if (--timer < 0) {
        this.timerRunning = false;
        console.log('timeup');
        this.subTimeout.unsubscribe();
      }
    })
  }

}
