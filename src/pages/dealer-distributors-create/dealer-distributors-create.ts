import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-dealer-distributors-create',
  templateUrl: 'dealer-distributors-create.html',
})
export class DealerDistributorsCreatePage {

  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  type: any;
  disable: any = false;
  isUpdate: boolean = true;
  input = {
    firstname: "", lastname: "", phno1: "", phno2: "", phno3: "", companyName: "", referenceCode: "",
    phoneType: "android", addr: "", gstNumber: "", acceptOnlinePayments: false
  };

  bankDetails = [{name: '', ifsc: '', number: ''}, {name: '', ifsc: null, number: null}];
  output = {"result": "", "actionType": "", "data": ""};
  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private platform: Platform,
              private apiService: ApiProvider,
              private formBuilder: FormBuilder,
              private translateService: TranslateService) {
    let lang = "en";
    if (UtilsProvider.lang) {
      lang = UtilsProvider.lang
    }
    UtilsProvider.sLog(lang);
    translateService.use(lang);
    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.user = navParams.get('item');
    this.type = navParams.get('type');

    if (this.type == 'view')
      this.disable = true;
    else
      this.disable = false;

    alertUtils.showLog(this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE VENDOR';
      this.buttonTitle = 'CREATE';
    } else {

      if (this.type == 'view') {
        this.pageTitle = 'VIEW VENDOR';
      } else {
        this.isUpdate = true;
        this.pageTitle = 'EDIT VENDOR';
        this.buttonTitle = 'UPDATE';
      }

      //updating values
      this.input.firstname = this.validate(this.user.firstname);
      this.input.lastname = this.validate(this.user.lastname);
      this.input.phno1 = this.user.mobileno;
      this.input.phno2 = this.user.mobileno_one;
      this.input.phno3 = this.user.mobileno_two;
      this.input.addr = this.user.address;
      this.input.companyName = this.validate(this.user.companyname);
      this.input.phoneType = this.user.phonetype;
      this.input.referenceCode = this.validate(this.user.reference_code);
      this.input.gstNumber = this.validate(this.user.gstno);
      this.bankDetails = this.user.bankdetails ? this.user.bankdetails : this.bankDetails;
    }

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;
            this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
            this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO;
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;
            this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
            this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  updateCbValue() {
    this.input.acceptOnlinePayments = !this.input.acceptOnlinePayments;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doValidation() {

    if (this.alertUtils.validateText(this.input.firstname, 'First name', 3, 50)) {
      if (this.alertUtils.validateText(this.input.lastname, 'Last name', 1, 50)) {
        if (this.alertUtils.validateNumber(this.input.phno1, "Mobile Number", 9, 9)) {
          if (this.alertUtils.validateText(this.input.companyName, "Company Name", 3, 50)) {
            if (this.alertUtils.validateText(this.input.addr, "Address", 5, 200)) {
              if (this.alertUtils.validateText(this.bankDetails[0].name, "Bank1 Name", 3, 50)) {
                if (this.alertUtils.validateText(this.bankDetails[0].ifsc, "Bank1 Ifsc", 5, 20)) {
                  if (this.alertUtils.validateNumber(this.bankDetails[0].number, "Bank1 Number", 5, 20)) {

                    this.showToast = false;
                    if (this.isUpdate)
                      this.doUpdate();
                    else
                      this.doCreate();
                  } else
                    this.showToast = true;
                } else
                  this.showToast = true;
              } else
                this.showToast = true;
            } else
              this.showToast = true;
          } else
            this.showToast = true;
        } else
          this.showToast = true;
      } else
        this.showToast = true;
    } else
      this.showToast = true;

    if (this.showToast) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }

  }

  doCreate() {
    /*{"User":{"company_logo":"company_logo_3333000025","user_type":"dealer","TransType":"create",
      "firstname":"venkat","lastname":"gvr","pwd":"3333000025","companyname":"dummy","referCode":"fhgff",
      "address":"fhhhg","loginid":"289","mobileno":"3333000025","phonetype":"no_smartphone",
      "dealer_mobileno":"9863636314","apptype":"moya","gstno":"fhhj"}}*/
    try {
      let input = {
        "User": {
          "TransType": 'create',
          "user_type": UserType.DEALER,
          "firstname": this.input.firstname,
          "lastname": this.input.lastname,
          "mobileno": this.input.phno1,
          "mobileno_one": this.input.phno2,
          "mobileno_two": this.input.phno3,
          "pwd": this.input.phno1,
          "address": this.input.addr,
          "companyname": this.input.companyName,
          "company_logo": 'company_logo_' + this.input.phno1,
          "referCode": this.input.referenceCode,
          "gstnumber": this.input.gstNumber,
          bankdetails: this.bankDetails,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createCustomer(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        this.alertUtils.showLog(res.data);
        this.alertUtils.showLog(res.data.message);

        if (res.data.code) {
          this.alertUtils.showToast(res.data.message);
        } else {
          this.output.result = res.result;
          this.output.actionType = 'create';
          this.output.data = res.data;

          if (res.result == this.alertUtils.RESULT_SUCCESS) {
            this.viewCtrl.dismiss(this.output);
            //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
          } else
            this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
        }
      }, error => {

      })
    } catch (e) {

    }
  }

  validate(s) {
    if (s == null || s == 'null')
      return '';
    else
      return s;
  }

  doUpdate() {

    try {
      let input = {
        "User": {
          "userid": this.user.userid,
          "user_type": UserType.DEALER,
          "firstname": this.input.firstname,
          "lastname": this.input.lastname,
          "aliasname": this.input.firstname,
          "mobileno": this.input.phno1,
          "mobileno_one": this.input.phno2,
          "mobileno_two": this.input.phno3,
          "phonetype": this.input.phoneType,
          "address": this.input.addr,
          "distributor": this.USER_ID,
          "companyname": this.input.companyName,
          "referCode": this.input.referenceCode,
          "gstnumber": this.input.gstNumber,
          bankdetails: this.bankDetails,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "apptype": APP_TYPE,
          "framework": FRAMEWORK
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog('input : ' + data);

      this.alertUtils.showLoading();
      this.apiService.putReq(this.apiService.updateProfile(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res.data);

        this.output.result = res.result;
        this.output.actionType = 'update';
        this.output.data = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {

      })
    } catch (e) {

    }
  }
}
