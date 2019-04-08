import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, LoadingController, ToastController} from "ionic-angular";
import "rxjs/add/operator/map";
import * as moment from "moment";
import { Device } from '@ionic-native/device/ngx';

export const SHOW_ALL = false;
export const IS_WEBSITE: boolean = true;

const KEY_USER_ID = 'secure_storage_userid';
const KEY_USERNAME = 'secure_storage_username';
const KEY_USER_PHNO = 'secure_storage_userphone';
const KEY_USER_EMAIL = 'secure_storage_useremailid';
const KEY_USER_PWD = 'secure_storage_userpwd';
const KEY_USER_ADDR = 'secure_storage_useraddr';
const KEY_USER_CITY = 'secure_storage_usercity';
const KEY_USER_STATE = 'secure_storage_userstate';
const KEY_USER_PIN = 'secure_storage_userpin';
const KEY_USER_IMGNAME = 'secure_storage_userimagename';
const KEY_USER_IMAGE_VERSION = 'secure_userimageversion';

const KEY_DEALER_ID = 'secure_storage_dealerid';
const KEY_DEALER_NAME = 'secure_storage_dealername';
const KEY_DEALER_PHONE = 'secure_storage_dealerphone';
const KEY_USER_LAT = 'secure_storage_userlat';
const KEY_USER_LNG = 'secure_storage_userlng';
const KEY_USER_LOGIN_STATUS = 'secure_storage_user_login_status';
const KEY_USER_PROMO_CODE = 'secure_storage_user_prome_code';
const KEY_USER_INFO = 'secure_storage_user_user_info';
const KEY_APP_FIRST_CALL_INFO = 'secure_storage_user_app_first_info';
export const APP_TYPE: string = "carwash";
export const APP_USER_TYPE: string = "admin";
export const MOBILE_TYPE: string = "android";
export const FRAMEWORK: string = "ionic";
export const RES_SUCCESS: string = "success";
export const INTERNET_ERR_MSG = "Please check internet connectivity and try again";
export const GEN_ERR_MSG = "Something went wrong please check internet connectivity and try again";
export const TRY_AGAIN_ERR_MSG = "Something went wrong please try again";
export const VALIDATE_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


export enum UserType {
  SALES = 'sales',
  SALES_TEAM = 'salesteam',
  DEALER = 'dealer',
  MANUFACTURER = 'manufacturer',
  CUSTOMER = 'customer',
  CUSTOMER_CARE = 'customercare',
  SUPER_SUPPLIER = 'supersupplier',
  SUPPLIER = 'supplier'
}

export enum OrderTypes {
  ORDERED         = 'ordered',
  ASSIGNED        = 'assigned',
  ACCEPT          = 'accept',
  DELIVERED       = 'delivered',
  CANCELLED       = 'cancelled',

  ORDER_STARTED   = 'orderstarted',
  DOORLOCK        = 'doorlock',
  CANNOT_DELIVER  = 'cannot_deliver',
  NOT_REACHABLE   = 'not_reachable',
  BACKTODEALER    = 'backtodealer',
  ONHOLD          = 'onhold',
  REJECTED        = 'rejected',
  NOT_BROADCASTED = 'not_broadcasted'
}

@Injectable()
export class UtilsProvider {

  private static _USER_IS_SUPER_DEALER: boolean = false;
  RESULT_SUCCESS: string = "success";
  public ERROR_MES = "";
  DIGITS = "[0-9]*";
  private pd;
  private START_STR = "Please enter ";

  constructor(public http: HttpClient,
              public toast: ToastController,
              public alertCtrl: AlertController,
              private device: Device,
              public loadingCtrl: LoadingController) {
    console.log('Hello UtilsProvider Provider');
  }

  private static _USER_ID: string = "";

  static get USER_ID(): string {
    return this._USER_ID;
  }

  private static _USER_NAME: string = "";

  static get USER_NAME(): string {
    return this._USER_NAME;
  }

  private static _USER_PHNO: string = "";

  static get USER_PHNO(): string {
    return this._USER_PHNO;
  }

  private static _USER_ADDR: string = "";

  static get USER_ADDR(): string {
    return this._USER_ADDR;
  }

  private static _USER_TYPE: string = "";

  static get USER_TYPE(): string {
    return this._USER_TYPE;
  }

  private static _USER_DEALER_ID: string = "";

  static get USER_DEALER_ID(): string {
    return this._USER_DEALER_ID;
  }

  private static _USER_DEALER_NAME: string = "";

  static get USER_DEALER_NAME(): string {
    return this._USER_NAME;
  }

  private static _USER_DEALER_PHNO: string = "";

  static get USER_DEALER_PHNO(): string {
    return this._USER_PHNO;
  }

  private static _USER_DEALER_ADDR: string = "";

  static get USER_DEALER_ADDR(): string {
    return this._USER_ADDR;
  }

  static get IS_SUPER_DEALER(): boolean {
    return this._USER_IS_SUPER_DEALER;
  }

  static setValues(uID: string, uName: string, uPhno: string, uAddr: string, uType: string,
                   uDealerID: string, uDealerName: string, uDealerPhno: string, uDealerAddr: string) {
    this._USER_ID = uID;
    this._USER_NAME = uName;
    this._USER_PHNO = uPhno;
    this._USER_ADDR = uAddr;
    this._USER_TYPE = uType;

    this._USER_DEALER_ID = uDealerID;
    this._USER_DEALER_NAME = uDealerName;
    this._USER_DEALER_PHNO = uDealerPhno;
    this._USER_DEALER_ADDR = uDealerAddr;
  }

  static formatDateToDDMMYYYY(date) {
    let d = new Date(date);
    return moment(d).format('DD-MM-YYYY');
  }

  static formatDateToYYYYMMDD(date) {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD');
  }

  showLog(val, lineNumber?, pageName?) {
    console.log(val);
    if (lineNumber)
      console.log(lineNumber);
    if (pageName)
      console.log(pageName);
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
    return this.device.uuid;
  }
}
