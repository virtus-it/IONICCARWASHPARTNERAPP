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
import {DealerDistributorsPage} from "../dealer-distributors/dealer-distributors";
import {DealerSuppliersPage} from "../dealer-suppliers/dealer-suppliers";


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

      this.setGCMDetails(res.data);

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

            if(uType == UserType.DEALER && input.issuperdealer){
              uDealerId = uId;
              uDealerName = uName;
              uDealerPhno = uPhno;
              uDealerAddr = uAddr;
            }else{
              uDealerId = input.sdealers.dealerid;
              uDealerName = input.sdealers.firstname +' '+input.sdealers.lastname;
              uDealerPhno = input.sdealers.mobileno;
              uDealerAddr = '';
            }

            UtilsProvider.setValues(uId,uName,uPhno,uAddr,uType,uDealerId,uDealerName,uDealerPhno,uDealerAddr);


            if(uType == UserType.DEALER||uType == UserType.CUSTOMER_CARE){
              if(input.issuperdealer == 'true')
              this.navCtrl.setRoot(DealerOrdersHomePage);
              else
                this.navCtrl.setRoot(DealerSuppliersPage,{from:'loginPage'});
            }else if(uType == UserType.SUPPLIER){
              this.navCtrl.setRoot(SupplierOrdersHomePage);
            }

          }else {
            //show alert
            //Its Admin Application
            //please use customer application

            alert('Its Admin application\n please use customer application');
          }

        }
      }else{
        alert(JSON.stringify(res.data));
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


  setGCMDetails(data) {
    let registrationId = this.alertUtils.getDeviceUUID();
    let input = {
      "User": {
        "userid": data.userid,
        "gcm_mailid": this.username,
        "gcm_regid": UtilsProvider.getGCM_ID(),
        "gcm_name": APP_USER_TYPE,
        "mobileno": this.username
      }
    };
    let gcmData = JSON.stringify(input);
    this.alertUtils.showLog('gcmData : '+gcmData);
    this.apiService.postReq(this.apiService.setGCMRegister(), gcmData).then(gcm => {
      this.alertUtils.showLog(gcmData);
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

}
