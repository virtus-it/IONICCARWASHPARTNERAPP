import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";

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
  isUpdate: boolean = true;
  input = {
    firstname: "", lastname: "", phno1: "", phno2: "",phno3: "", companyName: "", referenceCode: "",
    phoneType: "android", addr: "", gstNumber: "", acceptOnlinePayments: false
  };

  updateCbValue(){
   this.input.acceptOnlinePayments = !this.input.acceptOnlinePayments;
  }

  output = {"result": "", "actionType": "", "data": ""};


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private formBuilder: FormBuilder) {

    this.user = navParams.get('item');

    alertUtils.showLog(this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE VENDOR';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT VENDOR';
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
    }

    this.USER_ID = UtilsProvider.USER_ID;
    this.USER_TYPE = UtilsProvider.USER_TYPE;
    this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
    this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;
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
        if (this.alertUtils.validateNumber(this.input.phno1, "Mobile Number", 10, 10)) {
          if (this.alertUtils.validateText(this.input.companyName, "Company Name", 3, 10)) {
            //if (this.alertUtils.validateText(this.input.referenceCode, "Locality", 3, 50)) {
              if (this.alertUtils.validateText(this.input.addr, "Address", 5, 200)) {
                //if (this.alertUtils.validateText(this.input.gstNumber, "GST Number", 1, 10)) {
                  if (this.isUpdate)
                    this.doUpdate();
                  else
                    this.doCreate();
                /*} else
                  this.showToast = true;*/
              } else
                this.showToast = true;
            /*} else
              this.showToast = true;*/
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
          "pwd": 'paani',
          "phonetype": this.input.phoneType,
          "address": this.input.addr,
          "companyname": this.input.companyName,
          "company_logo": 'company_logo_'+this.input.phno1,
          "referCode": this.input.referenceCode,
          "gstnumber": this.input.gstNumber,
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

        this.output.result = res.result;
        this.output.actionType = 'create';
        this.output.data = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

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
          "user_type": UserType.DEALER,
          "firstname": this.input.firstname,
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
