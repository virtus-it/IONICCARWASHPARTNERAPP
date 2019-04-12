import { Component } from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, APP_USER_TYPE, FRAMEWORK, MOBILE_TYPE, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {NetworkProvider} from "../../providers/network/network";
import {DealerOrdersHomePage} from "../dealer-orders-home/dealer-orders-home";
import {SupplierOrdersHomePage} from "../supplier-orders-home/supplier-orders-home";
import {TranslateService} from "@ngx-translate/core";
import 'rxjs/add/observable/interval';
import {Observable, Subscription} from "rxjs";
import { Socket } from 'ng-socket-io';


@IonicPage()
@Component({
  selector: 'page-log-in',
  templateUrl: 'login.html',
})
export class LoginPage {

  //development
  username:string='9863636314';
  password:any='9863636314';
  public type = 'password';
  public showPass = false;
  errorText: string = "";
  showLogin = true;
  sub: Subscription;

  //production
/*   username:string='9863636315';
   password:any='98498';*/

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private networkProvider: NetworkProvider,
              private menuCtrl: MenuController,
              private alertUtils: UtilsProvider,
              private apiUrl : ApiProvider,
              private alertCtrl: AlertController,
              private apiService:ApiProvider,
              private socket: Socket,
              private translateService: TranslateService) {

    translateService.setDefaultLang('en');
    translateService.use('en');

    //supplier
/*    this.username = '9774937711';
    this.password = '9774937711';*/
  }

  ionViewDidLoad() {
   // console.log('ionViewDidLoad LogInPage');
    this.menuCtrl.enable(false);
  }

  logIn(){

    //this.utils.showToastSnackBar('clicked');

    let input = {
      "User": {
        "emailid": this.username,
        "mobileno": this.username,
        "pwd": this.password,
        //"useruniqueid": this.alertUtils.getDeviceUUID(),
        "apptype": APP_TYPE,
        "mobiletype": MOBILE_TYPE,
        "framework": FRAMEWORK,
        "app_user_type": APP_USER_TYPE
      }
    };

    let data = JSON.stringify(input);
    //input.User["useruniqueid"] = this.getUUID();

    this.alertUtils.showLog("data",data);

    this.alertUtils.showLoading();
    this.networkProvider.postReq(this.apiUrl.login(),data).then(res=>{
      this.alertUtils.hideLoading();
      this.alertUtils.showLog("res",res.data);

      //this.utils.showToastSnackBar(res.data);

      if(res.result == this.alertUtils.RESULT_SUCCESS){
        if(res.data && res.data.user){
          let input = res.data.user;
          let uType=input.USERTYPE;

          if(uType == UserType.DEALER ||
            uType == UserType.SUPPLIER ||
            uType == UserType.SALES_TEAM ||
            uType == UserType.SALES ||
            uType == UserType.CUSTOMER_CARE){

            let uId,uName,uPhno,uAddr,uDealerId,uDealerName,uDealerPhno,uDealerAddr;

            uId = input.userid;
            uName = input.first_name+" "+input.last_name;
            uPhno = input.mobileno;
            uAddr = input.address;

            if(uType == UserType.DEALER){
              uDealerId = uId;
              uDealerName = uName;
              uDealerPhno = uPhno;
              uDealerAddr = uAddr;
            }else{
              uDealerId = input.userid;
              uDealerName = input.userid;
              uDealerPhno = input.userid;
              uDealerAddr = input.userid;
            }

            UtilsProvider.setValues(uId,uName,uPhno,uAddr,uType,uDealerId,uDealerName,uDealerPhno,uDealerAddr);


            if(uType == UserType.DEALER||uType == UserType.CUSTOMER_CARE){
              //MyApp.updateList(UserType.DEALER);
              this.navCtrl.setRoot(DealerOrdersHomePage);
            }else if(uType == UserType.SUPPLIER){
             // MyApp.updateList(UserType.SUPPLIER);
              this.navCtrl.setRoot(SupplierOrdersHomePage);
            }
            //this.navCtrl.push(DealerOrdersHomePage);

          }else {
            //show alert
            //Its Admin Application
            //please use customer application

            alert('Its Admin application\n please use customer application');
          }

        }
      }else{
        alert(res);
      }


    },error=>{
      this.alertUtils.showLog(error);
      this.alertUtils.hideLoading();
    })

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

  setGCMDetails() {
    /*let registrationId = this.alertUtils.getGcmId();
    let input = {
      "User": {
        "userid": this.info.userid,
        "gcm_mailid": this.info.email,
        "gcm_regid": registrationId,
        "gcm_name": APP_USER_TYPE,
        "mobileno": this.mobileNumber
      }
    };
    let gcmData = JSON.stringify(input);
    this.apiService.postReq(this.apiService.setGCMRegister(), gcmData).then(gcm => {
      if (gcm.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.showToast("You have successfully logged in");

      } else {
        this.alertUtils.showToast("Could not register device");
      }
    }, err => {
      this.alertUtils.showToast("Could not register device");
      this.alertUtils.showLog(err);
    })*/
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


  /*getLocation() {
    let i=0;
    this.alertUtils.showToast('Tracking Initialized');
    this.sub = Observable.interval(10000).subscribe((val) => {
      try {
        let watch = this.geolocation.watchPosition({maximumAge: 0, timeout: 10000, enableHighAccuracy: true});
        watch.subscribe((data) => {
          this.alertUtils.showLog("lat : " + data.coords.latitude + "\nlog : " + data.coords.longitude + "\n" + new Date());
          if(data && data.coords && data.coords.latitude && data.coords.longitude){
            this.trackingUpdate(data,i);
          }
        });
      } catch (e) {
        this.alertUtils.showLog(e);
      }

    }, (error) => {
      this.alertUtils.showLog("error");
    })
  }

  trackingUpdate(data, i) {
    this.alertUtils.showLog('SOCKET : STARTED');
    this.socket.connect();
    this.socket.emit('carwashserviceenginerstarted', {"lat":data.coords.latitude, "log":data.coords.longitude});
    this.alertUtils.showLog('SOCKET : ENDEDED');
  }*/

}
