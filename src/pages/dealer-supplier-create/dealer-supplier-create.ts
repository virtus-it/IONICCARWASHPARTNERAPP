import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-dealer-supplier-create',
  templateUrl: 'dealer-supplier-create.html',
})
export class DealerSupplierCreatePage {

  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;


  input = {firstname: "", phno1: "", phno2: "", id:"", vechicleNumber:"", addr:"", flottingCash:""};

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
      this.pageTitle = 'CREATE SUPPLIER';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT SUPPLIER';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.firstname = this.user.firstname;
      this.input.phno1 = this.user.mobileno;
      this.input.phno2 = this.user.mobileno_one;
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
      if (this.alertUtils.validateNumber(this.input.phno1, "Mobile Number", 10, 10)) {
        if(this.alertUtils.validateNumber(this.input.id, 'ID',2,10)){
          if(this.alertUtils.validateText(this.input.vechicleNumber, "Vechicle Number", 4, 10)){
            if(this.alertUtils.validateText(this.input.flottingCash,"Flotting Cash", 1, 8)){
              if(this.alertUtils.validateText(this.input.addr, "Address", 4, 100)){
                if (this.isUpdate)
                  this.doUpdate();
                else
                  this.doCreate();
              }else
                this.showToast = true;
            }else
              this.showToast = true;
          }else
            this.showToast = true;
        }else
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
          "TransType": 'create',
          "user_type": UserType.SUPPLIER,
          "firstname": this.input.firstname,
          "mobileno": this.input.phno1,
          "altmobileno": this.input.phno2,
          "id": this.input.id,
          "vechicle_number": this.input.vechicleNumber,
          "flotting_cash": this.input.flottingCash,
          "address": this.input.addr,
          "issuppersupplier": false,
          "pwd": 'paani',
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
          "user_type": UserType.SUPPLIER,
          "firstname": this.input.firstname,
          "mobileno": this.input.phno1,
          "altmobileno": this.input.phno2,
          "issuppersupplier": false,
          "pwd": 'paani',
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
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
