import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, LoadingController, Platform, ToastController} from "ionic-angular";
import "rxjs/add/operator/map";
import * as moment from "moment";
import {UniqueDeviceID} from '@ionic-native/unique-device-id';
import {Geolocation} from '@ionic-native/geolocation';
import {AppVersion} from "@ionic-native/app-version";
import {Network} from "@ionic-native/network";
import {Subscription} from "rxjs";
import {NativeStorage} from '@ionic-native/native-storage';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

export const SHOW_ALL = false;
export const IS_WEBSITE: boolean = false;
const SHOW_LOGS = false;
export const KEY_USER_INFO = 'secure_storage_user_info';
const KEY_GCM_ID = 'secure_storage_user_gcm_id';
const KEY_LOGIN_STATUS = 'secure_storage_user_login_status';


export const KEY_TRACKING_STATUS = 'secure_storage_tracking_status';
export const KEY_TRACKING_ORDER = 'secure_storage_tracking_order';

export const IMAGE_QUALITY: number = 30;
export const IMAGE_WIDTH: number = 256;
export const IMAGE_HEIGHT: number = 256;

export const APP_TYPE: string = "carwash";
export const APP_USER_TYPE: string = "admin";
export const MOBILE_TYPE: string = "android";
export const FRAMEWORK: string = "ionic";
export const RES_SUCCESS: string = "success";
export const INTERNET_ERR_MSG = "Please check internet connectivity and try again";
export const GEN_ERR_MSG = "Something went wrong please check internet connectivity and try again";
export const TRY_AGAIN_ERR_MSG = "Something went wrong please try again";
export const VALIDATE_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const KEY_USER_LANG = 'secure_storage_user_lang';
export enum UserType {
  SALES = 'sales',
  SALES_TEAM = 'salesteam',
  DEALER = 'dealer',
  MANUFACTURER = 'manufacturer',
  CUSTOMER = 'customer',
  CUSTOMER_CARE = 'customercare',
  SUPER_SUPPLIER = 'supersupplier',
  SUPPLIER = 'supplier',
  Job_Assigner = 'job_assigner',
  Billing_Administrator = 'billing_administrator'
}

export enum OrderTypes {
  ORDERED = 'ordered',
  ASSIGNED = 'assigned',
  ACCEPT = 'accept',
  DELIVERED = 'delivered',
  JOB_COMPLETED = 'jobcompleted',
  ARRIVED = 'arrived',
  CANCELLED = 'cancelled',

  ORDER_STARTED = 'orderstarted',
  JOB_STARTED = 'jobstarted',
  DOORLOCK = 'doorlock',
  CANNOT_DELIVER = 'cannot_deliver',
  NOT_REACHABLE = 'not_reachable',
  BACKTODEALER = 'backtodealer',
  ONHOLD = 'onhold',
  REJECTED = 'rejected',
  NOT_BROADCASTED = 'not_broadcasted'
}

@Injectable()
export class UtilsProvider {
  
  static lang: string = "en";
  private static _USER_PHNO: string = "";
  private static _USER_ADDR: string = "";
  private static _GCM_ID: string = "";
  private static _USER_DEALER_NAME: string = "";
  private static _USER_DEALER_ADDR: string = "";
  private static _USER_IS_SUPER_DEALER: boolean = false;
  static ORDER_STUAS_UPDATED: boolean = false;
  RESULT_SUCCESS: string = "success";
  public ERROR_MES = "";
  DIGITS = "[0-9]*";
  sub: Subscription;
  location = {latitude: '', longitude: ''};
  private pd;
  private START_STR = "Please enter ";

  constructor(public http: HttpClient,
              public toast: ToastController,
              public alertCtrl: AlertController,
              private geolocation: Geolocation,
              private uniqueDeviceID: UniqueDeviceID,
              private nativeStorage: NativeStorage,
              private platform: Platform,
              private launchNavigator: LaunchNavigator,
              private network: Network,
              private appVersion: AppVersion,
              public loadingCtrl: LoadingController) {
  }

  private static _USER_ID: string = "";

  static get USER_ID(): string {
    return this._USER_ID;
  }

  private static _USER_NAME: string = "";

  static get USER_NAME(): string {
    return this._USER_NAME;
  }
  setLang(data) {
    this.nativeStorage.setItem(KEY_USER_LANG, data)
      .then(() => this.showLog('Stored  USER_INFO'), error => console.error('Error storing data', error));
  }
  getLang() {

    return this.nativeStorage.getItem(KEY_USER_LANG);
  }
  private static _ISSUPER_DEALER: boolean = false;

  static get ISSUPER_DEALER(): boolean {
    return this._ISSUPER_DEALER;
  }

  private static _USER_TYPE: string = "";

  static get USER_TYPE(): string {
    return this._USER_TYPE;
  }

  private static _USER_DEALER_ID: string = "";

  static get USER_DEALER_ID(): string {
    return this._USER_DEALER_ID;
  }

  private static _USER_DEALER_PHNO: string = "";

  static get USER_DEALER_PHNO(): string {
    return this._USER_PHNO;
  }

  private static _USER_INFO: string = "";

  static get USER_INFO(): string {
    return this._USER_INFO;
  }

  static setIsSuperDealer(id: boolean) {
    this._ISSUPER_DEALER = id;
  }

  static setGCM(gcmID: string) {
    this._GCM_ID = gcmID;
  }

  static getGCM_ID(): string {
    return this._GCM_ID;
  }
  static sLog(val, lineNumber?, pageName?) {
    console.log(val);
   if (lineNumber)
   console.log(lineNumber);
   if (pageName)
   console.log(pageName);
 }
  static setUSER_INFO(userInfo) {
    this._USER_INFO = userInfo;
  }

   getTodayDate() {
    return moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
  }

  static formatDateToDDMMYYYY(date) {
    let d = new Date(date);
    return moment(d).format('DD-MM-YYYY');
  }

  static formatDate(s:string){
    /*//let date = moment(s, 'YYYY-MM-DD HH:mm:ss').toDate();
    var offset = moment().utcOffset();
    return moment.utc(date).utcOffset(offset).format("DD-MM-YYYY HH:mm");
    //return moment.utc(date).local().format('DD-MM-YYYY HH:mm');*/

    /*var date = moment(s, 'YYYY-MM-DD HH:mm:ss').toDate()

    console.log(date); // 2015-09-13 03:39:27

    var stillUtc = moment.utc(date).toDate();
    return  moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');*/

    let utcTime = s;
    var offset = moment().utcOffset();
    return  moment.utc(utcTime).utcOffset(offset).format("DD-MM-YYYY HH:mm");

  }

  static formatDateToYYYYMMDD(date) {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD');
  }

  initUser(user: any) {
    try {

      if (user) {
        this.showLog(user);
        UtilsProvider.setUSER_INFO(user);

        //user info
        UtilsProvider._USER_ID = user.userid;
        UtilsProvider._USER_NAME = user.first_name + " " + user.last_name;
        UtilsProvider._USER_PHNO = user.mobileno;
        UtilsProvider._USER_ADDR = user.address;
        UtilsProvider._USER_TYPE = user.USERTYPE;

        if (user.issuperdealer && user.issuperdealer == "true") {
          UtilsProvider.setIsSuperDealer(true);
        } else {
          UtilsProvider.setIsSuperDealer(false);
        }

        //dealer info
        if (user.USERTYPE == UserType.DEALER && user.issuperdealer) {
          UtilsProvider._USER_DEALER_ID = UtilsProvider._USER_ID;
          UtilsProvider._USER_DEALER_NAME = UtilsProvider._USER_NAME;
          UtilsProvider._USER_DEALER_PHNO = UtilsProvider._USER_PHNO;
          UtilsProvider._USER_DEALER_ADDR = UtilsProvider._USER_TYPE;
        } else {
          UtilsProvider._USER_DEALER_ID = user.sdealers.dealerid;
          UtilsProvider._USER_DEALER_NAME = user.sdealers.firstname + ' ' + user.sdealers.lastname;
          UtilsProvider._USER_DEALER_PHNO = user.sdealers.mobileno;
          UtilsProvider._USER_DEALER_ADDR = '';
        }

      } else {
        this.showLog('logout');
        UtilsProvider._USER_ID = '';
        UtilsProvider._USER_NAME = '';
        UtilsProvider._USER_PHNO = '';
        UtilsProvider._USER_ADDR = '';
        UtilsProvider._USER_TYPE = '';

        UtilsProvider._USER_DEALER_ID = '';
        UtilsProvider._USER_DEALER_NAME = '';
        UtilsProvider._USER_DEALER_PHNO = '';
        UtilsProvider._USER_DEALER_ADDR = '';
      }

      /*try {
        this.platform.ready().then(() => {
          this.setSecureValue(KEY_USER_INFO,user);
        },err =>{
          console.log(err);
        });
      }catch (e) {
        this.showLog(e);
      }*/

    } catch (e) {
      this.showLog(e);
    }

  }

  //storage
  setSecureValue(keyName: string, keyValue: any) {
    this.nativeStorage.setItem(keyName, keyValue)
      .then(() => console.log('Stored  Data!'),
        error => console.error('Error storing data', error));

  }

  setValue(keyName: string, keyValue: any) {
    return this.nativeStorage.setItem(keyName, keyValue);

  }

  setUserInfo(keyValue: any) {
    return this.nativeStorage.setItem(KEY_USER_INFO, keyValue);

  }

  saveGcmId(keyValue: any) {
    this.nativeStorage.setItem(KEY_GCM_ID, keyValue)
      .then(() => console.log('Stored  Data!'),
        error => console.error('Error storing data', error));

  }

  getSecValue(keyName: string) {
    return this.nativeStorage.getItem(keyName);
  }

  getUserInfo(initCall?: boolean) {
    try {
      if (initCall) {
        this.nativeStorage.getItem(KEY_USER_INFO).then((success) => {
          // return storage value
          return success;
        }, error => {
          // return static value if there is no value
          // for browser
          return UtilsProvider.USER_INFO;
        })
      } else
        return UtilsProvider.USER_INFO;
    } catch (e) {
      this.showLog(e);
      //return static value if any expection
      return UtilsProvider.USER_INFO;
    }
  }

  getGcmId() {
    return this.nativeStorage.getItem(KEY_GCM_ID);
  }

  setSubscription(sub) {
    this.sub = sub;
  }

  stopSubscription() {
    if (this.sub)
      this.sub.unsubscribe();
  }

  showLog(val, lineNumber?, pageName?) {
    if(SHOW_LOGS){
      console.log(val);
      if (lineNumber)
        console.log(lineNumber);
      if (pageName)
        console.log(pageName);
    }

  }

  showToastWithButton(message: string, showCloseButton: boolean, showCloseButtonText: string) {
    const toast = this.toast.create({
      message: message,
      showCloseButton: showCloseButton,
      closeButtonText: showCloseButtonText
    });
    toast.present();
  }

  showToast(message: string) {
    /*this.toast.show(message, '2000', 'bottom').subscribe(
      toast => {
        this.showLog(toast);
     });*/

    let toast = this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


  /*showLoadingWithText(text) {
    this.pd = this.loadingCtrl.create({
      content: text,
      dismissOnPageChange: true
    });
    this.pd.present();
    setTimeout(() => {
      this.pd.dismiss();
    }, 5000);

  }*/

  showToastSnackBar(message: string) {
    let toast = this.toast.create({
      message: message,
      duration: 1400
    });
    toast.present();
  }

  showLoading() {
    this.pd = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.pd.present();
  }

  hideLoading() {
    if (this.pd)
      this.pd.dismiss();

  }

  validateText(s: string, fieldName: string, minLength: any, maxLength: any): boolean {

    this.showLog("***************" + fieldName + " Validation"
      + "***************");
    this.showLog("Field Value : " + s);
    this.showLog("Min Length  : " + minLength);
    this.showLog("maxLength   : " + maxLength);
    this.showLog("Length      : " + s.length);

    if (s) {
      if (s.length >= minLength) {
        if (s.length <= maxLength) {
          if (s.indexOf("'") == -1) {
            return true;
          } else {
            this.showLog('Single Coat' + " : Detected");
            this.ERROR_MES = "single coat not allowed in " + fieldName;
            this.showLog("Error Mes   : " + this.ERROR_MES);
            return false;
          }
        } else {
          this.showLog('Max Length' + " : Failed");
          this.ERROR_MES = this.START_STR + "max " + maxLength
            + " characters of " + fieldName;
          this.showLog("Error Mes   : " + this.ERROR_MES);
          return false;
        }
      } else {
        this.showLog('Min Length' + "   : Failed");
        this.ERROR_MES = this.START_STR + "atleast " + minLength
          + " characters of " + fieldName;
        this.showLog("Error Mes   : " + this.ERROR_MES);
        return false;
      }
    } else {
      this.showLog('No value');
      this.ERROR_MES = this.START_STR + fieldName;
      this.showLog("Error Mes   : " + this.ERROR_MES);
      return false;
    }

  }

  isValidMobile(mob): any {

    let regExp = /^[0-9]{10}$/;

    if (!regExp.test(mob)) {
      return {"invalidMobile": true};
    }
    return null;
  }

  isValidQty(mob): any {

    let regExp = /^[0-9]+$/;

    if (!regExp.test(mob)) {
      return {"invalidMobile": true};
    }
    return null;
  }

  isValidName(name): any {

    let regExp = /^[a-z][A-Z]{50}$/;

    if (!regExp.test(name)) {
      return {"invalidMobile": true};
    }
    return null;
  }

  validateNumber(s: string, fieldName: string, minLength: any, maxLength: any) {

    this.showLog("*************** " + fieldName + " Validation"
      + " ***************");
    this.showLog("Field Value : " + s);
    this.showLog("Min Length  : " + minLength);
    this.showLog("maxLength   : " + maxLength);

    if (s) {
      if (s.match(this.DIGITS)) {
        if (s.length >= minLength) {
          if (s.length <= maxLength) {
            if (s.indexOf("'") == -1) {
              return true;
            } else {
              this.ERROR_MES = "single coat not allowed in " + fieldName;
              this.showLog("Error Mes   : " + this.ERROR_MES);
              return false;
            }
          } else {
            this.ERROR_MES = this.START_STR + "max " + maxLength
              + " digits of " + fieldName;
            this.showLog("Error Mes   : " + this.ERROR_MES);
            return false;
          }
        } else {
          this.ERROR_MES = this.START_STR + "atleast " + minLength
            + " digits of " + fieldName;
          this.showLog("Error Mes   : " + this.ERROR_MES);
          return false;
        }
      } else {
        this.ERROR_MES = this.START_STR + "only digits";
        this.showLog("Error Mes   : " + this.ERROR_MES);
        return false;
      }
    } else {
      this.ERROR_MES = this.START_STR + fieldName;
      return false;
    }

  }

  validate(s) {
    if (s == null || s == 'null')
      return '';
    else
      return s;
  }

  showAlert(title: string, message: string, btnName: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: btnName,
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  getDeviceUUID() {
    return this.uniqueDeviceID.get();
  }

  getVersionCode() {
    return this.appVersion.getVersionCode();
  }
  getVersionNumber() {
    return this.appVersion.getVersionNumber();
  }

  getUserId() {
    this.initUser(this.getUserInfo());
    return UtilsProvider.USER_ID;
  }

  networkStatus() {
    if (this.network.type == "none")
      return false;
    else
      return true;
  }

  getCurrentLocation() {
    try {

      return this.geolocation.getCurrentPosition();

      /*let watch = this.geolocation.watchPosition({enableHighAccuracy: true });
      watch.subscribe((data) => {
        // data can be a set of coordinates, or an error (if an error occurred).
        try {
          if(data && data.coords && data.coords.latitude && data.coords.longitude) {
            this.location.latitude = (data.coords.latitude).toString();
            this.location.longitude = (data.coords.longitude).toString();
          }
        }catch (e) {
          this.showLog(e);
        }
      });*/

    } catch (e) {
      this.showLog(e);
    }
  }

  showNavigation(addr){
    try {
      this.showLog(addr);
      let options: LaunchNavigatorOptions = {
        //start: 'London, ON',
        //app: LaunchNavigator.APP.GOOGLE_MAPS,
      };

      this.launchNavigator.navigate(addr, options)
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    }catch (e) {

    }
  }

  showLogs(mes?, val?) {
    if(SHOW_LOGS){
      console.log('\n -->');
      if(mes)
        console.log(mes);
      if(val)
        console.log(val);
    }

  }

  showLogRes(api?, input?, res?) {
    if(SHOW_LOGS){
      console.log('\n>> Request Started...');
      try {
        if (api)
          console.log(api);
        if (input)
          console.log('Input => ' + input);

        if (res) {
          try {
            console.log('Output =>');
            console.log(res);
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
      }
      console.log('<< Request End');
    }
  }

  showLogErr(api?, input?, err?) {
    if(SHOW_LOGS){
      console.log('\n>> Request Started...');
      try {
        if (api)
          console.log(api);
        if (input)
          console.log('Input => ' + input);

        if (err) {
          try {
            console.log('Error =>');
            console.log(err);
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
      }
      console.log('<< Request End');
    }
  }
}
