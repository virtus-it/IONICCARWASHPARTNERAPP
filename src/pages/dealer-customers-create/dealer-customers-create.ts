import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, Platform, ViewController} from "ionic-angular";
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {FormBuilder} from "@angular/forms";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-dealer-customers-create',
  templateUrl: 'dealer-customers-create.html',
})
export class DealerCustomersCreatePage {


  USER_ID;
  USER_TYPE;
  DEALER_ID;

  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;
  input = {
    firstname: "", lastname: "", phno1: "", email: "", phno2: "", phno3: "", platNo: "",
    locality: "", addr: "", advAmt: "", paymentType: "cod", customerType: "residential"
  };

  output = {"result": "", "actionType": "", "data": ""};


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private formBuilder: FormBuilder,
              private translateService: TranslateService) {
                let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);
    this.user = navParams.get('item');

    alertUtils.showLog(this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE CUSTOMER';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT CUSTOMER';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.firstname = this.alertUtils.validate(this.user.firstname);
      this.input.lastname = this.alertUtils.validate(this.user.lastname);
      this.input.phno1 = this.user.mobileno;
      this.input.email = this.user.emailid;
      this.input.phno2 = this.user.mobileno_one;
      this.input.phno3 = this.user.mobileno_two;
      this.input.platNo = this.alertUtils.validate(this.user.buildingname);
      this.input.locality = this.alertUtils.validate(this.user.locality);
      this.input.addr = this.alertUtils.validate(this.user.address);
      //this.input.advAmt = JSON.stringify(this.user.payments.advance_amount);
      if (this.user.paymenttype)
        this.input.paymentType = this.user.paymenttype;

      this.input.customerType = this.user.registertype;

      this.alertUtils.showLog(this.user);
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
          let value = UtilsProvider.USER_INFO
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
          /* if (this.alertUtils.isValidMobile(this.input.phno1)) {*/
          if (this.alertUtils.validateText(this.input.platNo, "Plat No", 1, 10)) {
            if (this.alertUtils.validateText(this.input.locality, "Locality", 3, 50)) {
              if (this.alertUtils.validateText(this.input.addr, "Address", 5, 200)) {
                //if (this.alertUtils.validateText(this.input.advAmt, "Advance Amount", 1, 10)) {
                if (this.isUpdate)
                  this.doUpdate();
                else
                  this.doCreate();
                /* } else
                 this.showToast = true;*/
              } else
                this.showToast = true;
            } else
              this.showToast = true;
          } else
            this.showToast = true;
          /*} else
           this.alertUtils.showToast('Invalid mobile number');*/
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
    try {
      let input = {
        "User": {
          //"registertype": this.input.customerType,
          "user_type": UserType.CUSTOMER,
          "TransType": 'create',
          "firstname": this.input.firstname,
          "lastname": this.input.lastname,
          "aliasname": this.input.firstname,
          "mobileno": this.input.phno1,
          "mobileno_one": this.input.phno2,
          "mobileno_two": this.input.phno3,
          "emailid": this.input.email,
          "pwd": this.input.phno1,
          //"advamt": this.input.advAmt,
          "paymenttype": this.input.paymentType,
          /*"areaname": this.input.name,
           "areaid": this.input.name,*/
          "address": this.input.addr,
          "locality": this.input.locality,
          "buildingname": this.input.platNo,
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

  doUpdate() {

    try {
      let input = {
        "User": {
          "userid": this.user.userid,
          "firstname": this.input.firstname,
          "lastname": this.input.lastname,
          "aliasname": this.input.firstname,
          "mobileno": this.input.phno1,
          "mobileno_one": this.input.phno2,
          "mobileno_two": this.input.phno3,
          "emailid": this.input.email,
          "advamt": this.input.advAmt,
          "paymenttype": this.input.paymentType,
          "address": this.input.addr,
          "distributor": this.USER_ID,
          "locality": this.input.locality,
          "buildingname": this.input.platNo,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "user_type": UserType.CUSTOMER,
          "registertype": this.input.customerType,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog('input : ' + data);

      this.alertUtils.showLoading();
      this.apiService.putReq(this.apiService.updateProfile(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);


        if(res.result == this.alertUtils.RESULT_SUCCESS){
          if (res.data.code) {
            this.alertUtils.showToast(res.data.message);
          } else {
            this.output.result = res.result;
            this.output.actionType = 'update';
            this.output.data = res.data;

            if (res.result == this.alertUtils.RESULT_SUCCESS) {
              this.viewCtrl.dismiss(this.output);
            }
          }
        }else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
      }, error => {

      })
    } catch (e) {

    }
  }

}
