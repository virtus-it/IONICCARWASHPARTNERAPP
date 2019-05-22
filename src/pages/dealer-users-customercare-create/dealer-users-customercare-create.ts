import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-dealer-users-customercare-create',
  templateUrl: 'dealer-users-customercare-create.html',
})
export class DealerUsersCustomercareCreatePage {

  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;
  usersList = [{"name": "Customer Care", "value": "customercare"},
    {"name": "Job Assigner", "value": "job_assigner"},
    {"name": "Billing Administrator", "value": "billing_administrator"}];
  input = {
    firstname: "", lastname: "", phno1: "", phno2: "", phno3: "", companyName: "", referenceCode: "",
    phoneType: "android", addr: "", gstNumber: "", acceptOnlinePayments: false, userType: 'customercare'
  };

  output = {"result": "", "actionType": "", "data": ""};


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private formBuilder: FormBuilder) {

    this.user = navParams.get('item');

    alertUtils.showLog(this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE USER';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT USER';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.firstname = this.user.firstname;
      this.input.lastname = this.user.lastname;
      this.input.phno1 = this.user.mobileno;
      this.input.phno2 = this.user.mobileno_one;
      this.input.phno3 = this.user.mobileno_two;
      this.input.addr = this.user.address;
      this.input.companyName = this.user.companyname;
      this.input.phoneType = this.user.phonetype;
      this.input.referenceCode = this.user.reference_code;
      this.input.gstNumber = this.user.gstno;
      if (this.user.usertype)
        this.input.userType = this.user.usertype;

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

  updateDetails(event, userType) {
    this.input.userType = userType;
    /*this.alertUtils.showLog(userType);
    this.alertUtils.showLog(this.input);
    this.alertUtils.showLog(this.input.userType);*/
  }

  doValidation() {

    if (this.alertUtils.validateText(this.input.firstname, 'First name', 3, 50)) {
      if (this.alertUtils.validateText(this.input.lastname, 'Last name', 1, 50)) {
        if (this.alertUtils.validateNumber(this.input.phno1, "Mobile Number", 9, 9)) {
          //if (this.alertUtils.validateText(this.input.companyName, "Company Name", 3, 10)) {
          //if (this.alertUtils.validateText(this.input.referenceCode, "Locality", 3, 50)) {
          //if (this.alertUtils.validateText(this.input.addr, "Address", 5, 200)) {
          //if (this.alertUtils.validateText(this.input.gstNumber, "GST Number", 1, 10)) {
          if (this.isUpdate)
            this.doUpdate();
          else
            this.doCreate();
          /*} else
            this.showToast = true;*/
          /*} else
            this.showToast = true;*/
          /*} else
            this.showToast = true;*/
          /*} else
            this.showToast = true;*/
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
    /*{"User":{"company_logo":"company_logo_3333000025","user_type":"dealer","TransType":"create",
      "firstname":"venkat","lastname":"gvr","pwd":"3333000025","companyname":"dummy","referCode":"fhgff",
      "address":"fhhhg","loginid":"289","mobileno":"3333000025","phonetype":"no_smartphone",
      "dealer_mobileno":"9863636314","apptype":"moya","gstno":"fhhj"}}*/
    try {
      let input = {
        "User": {
          "TransType": 'create',
          "user_type": this.input.userType,
          "firstname": this.input.firstname,
          "lastname": this.input.lastname,
          "mobileno": this.input.phno1,
          "distributor":this.USER_ID,
          /* "mobileno_one": this.input.phno2,
           "mobileno_two": this.input.phno3,*/
          "pwd": this.input.phno1,
          // "phonetype": this.input.phoneType,
          // "address": this.input.addr,
          //"companyname": this.input.companyName,
          //"company_logo": 'company_logo_'+this.input.phno1,
          //"referCode": this.input.referenceCode,
          //"gstnumber": this.input.gstNumber,
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
          "user_type": this.input.userType,
          "firstname": this.input.firstname,
          "distributor":this.USER_ID,
          "lastname": this.input.lastname,
          "aliasname": this.input.firstname,
          "mobileno": this.input.phno1,
          "mobileno_one": this.input.phno2,
          "mobileno_two": this.input.phno3,
          "phonetype": this.input.phoneType,
          "address": this.input.addr,
          "companyname": this.input.companyName,
          "referCode": this.input.referenceCode,
          "gstnumber": this.input.gstNumber,
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
