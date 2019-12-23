import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider } from "../../providers/utils/utils";
import { ApiProvider } from "../../providers/api/api";
import { FormBuilder } from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

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
  showProgress = true;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;
  distributorsList: any = [];
  USER_INFO: any;
  showVendor: boolean = false;


  input = {
    firstname: "", phno1: "", phno2: "", id: "", vechicleNumber: "", type:'topup',
    addr: "", flottingCash: "", distributor: "", distributorId: "", tracking: "OFF"
  };

  output = { "result": "", "actionType": "", "data": "" };


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
    this.alertUtils.showLog('showVendor : ' + this.showVendor);

    this.user = navParams.get('item');

    alertUtils.showLog(this.user);


    if (this.user == '') {
      this.isUpdate = false;
      this.pageTitle = 'CREATE SERVICE AGENT';
      this.buttonTitle = 'CREATE';
      this.input.tracking = "ON";
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT SERVICE AGENT';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.firstname = this.user.firstname;
      this.input.phno1 = this.user.mobileno;
      this.input.phno2 = this.user.mobileno_one;
      this.input.id = this.user.id;
      this.input.vechicleNumber = this.validate(this.user.vechicle_number);
      this.input.flottingCash = '0';
      this.input.addr = this.validate(this.user.address);
      if (this.user.tracking) {
        this.input.tracking = this.user.tracking;
      }

      if(this.user.associateddealer && this.user.associateddealer.user_id)
      this.input.distributorId = JSON.stringify(this.user.associateddealer.user_id);

      if(this.user.associateddealer && this.user.associateddealer.firstname)
      this.input.distributor = this.validate(this.user.associateddealer.firstname);
        //+ ' ' + this.validate(this.user.associateddealer.lastname);

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

            this.USER_INFO = UtilsProvider.USER_INFO;

            if ((this.USER_INFO.USERTYPE == UserType.DEALER && this.USER_INFO.issuperdealer == "true")
              || this.USER_INFO.USERTYPE == UserType.CUSTOMER_CARE) {
              this.showVendor = true;
            }

            //initial call
            if (this.showVendor)
              this.getDistributors();
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

            this.USER_INFO = UtilsProvider.USER_INFO;

            if ((this.USER_INFO.USERTYPE == UserType.DEALER && this.USER_INFO.issuperdealer == "true")
              || this.USER_INFO.USERTYPE == UserType.CUSTOMER_CARE) {
              this.showVendor = true;
            }

            //initial call
            if (this.showVendor)
              this.getDistributors();
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  updateDistributorDetails(event, distributor) {
    this.input.distributor = distributor.firstname + ' ' + distributor.lastname;
    this.input.distributorId = distributor.userid;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doValidation() {

    if (this.alertUtils.validateText(this.input.firstname, 'First name', 3, 50)) {
      if (this.alertUtils.validateNumber(this.input.phno1, "Mobile Number", 9, 9)) {
        if (this.alertUtils.validateNumber(this.input.id, 'ID', 2, 10)) {
          if (this.alertUtils.validateText(this.input.vechicleNumber, "Vechicle Number", 4, 10)) {
            //if (this.alertUtils.validateText(this.input.flottingCash, "Flotting Cash", 1, 8)) {
              if (this.alertUtils.validateText(this.input.addr, "Address", 4, 100)) {
              if (this.alertUtils.validateText(this.input.distributor, "Vendor", 1, 50)) {

                this.showToast = false;
                if (this.isUpdate)
                  this.doUpdate();
                else
                  this.doCreate();
              } else {
                this.alertUtils.showToast('Please select any vendor');
              }
              } else
                this.showToast = true;
            /*} else
              this.showToast = true;*/
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

    try {
      let dID;

      if (this.input.distributorId)
        dID = this.input.distributorId;
      else
        dID = this.USER_ID;

      let input = {
        "User": {
          "TransType": 'create',
          "user_type": UserType.SUPPLIER,
          "firstname": this.input.firstname,
          "mobileno": this.input.phno1,
          "altmobileno": this.input.phno2,
          "id": this.input.id,
          "vechicle_number": this.input.vechicleNumber,
          "type":this.input.type,
          "flotting_cash": this.input.flottingCash,
          "address": this.input.addr,
          "tracking": this.input.tracking,
          "distributor": dID,
          "issuppersupplier": false,
          "pwd": this.input.phno1,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      if(!input.User.flotting_cash)
        input.User['flotting_cash'] = null;

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
          "user_type": UserType.SUPPLIER,
          "firstname": this.input.firstname,
          "mobileno": this.input.phno1,
          "altmobileno": this.input.phno2,
          "issuppersupplier": false,
          "pwd": this.input.phno1,
          "id": this.input.id,
          "vechicle_number": this.input.vechicleNumber,
          "type":this.input.type,
          "flotting_cash": this.input.flottingCash,
          "tracking": this.input.tracking,
          "address": this.input.addr,
          "distributor": this.input.distributorId,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      if(!input.User.flotting_cash)
        input.User['flotting_cash'] = null;

      let data = JSON.stringify(input);

      this.alertUtils.showLog('input : ' + data);

      this.alertUtils.showLoading();
      this.apiService.putReq(this.apiService.updateProfile(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);

        if (res.data.code) {
          this.alertUtils.showToast(res.data.message);
        } else {
          this.output.result = res.result;
          this.output.actionType = 'update';
          this.output.data = res.data;

          if (res.result == this.alertUtils.RESULT_SUCCESS) {
            this.viewCtrl.dismiss(this.output);
          } else
            this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
        }
      }, error => {

      })
    } catch (e) {

    }
  }

  getDistributors() {

    try {
      let input = {
        "root": {
          "userid": UtilsProvider.USER_DEALER_ID,
          "usertype": UserType.DEALER,
          "loginid": UtilsProvider.USER_ID,
          "lastuserid": '0',
          "apptype": APP_TYPE,
        }
      };

      this.alertUtils.showLog(JSON.stringify(input));

      this.showProgress = true;
      this.apiService.postReq(this.apiService.distributors(), JSON.stringify(input)).then(res => {
        this.alertUtils.showLog(res);
        this.showProgress = false;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i]["firstname"] = this.validate(res.data[i].firstname);
            res.data[i]["lastname"] = this.validate(res.data[i].lastname);
            this.distributorsList.push(res.data[i]);
          }

          //this.openAssignForwardModal();
        }
      }, error => {
      })
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }

  validate(s) {
    if (s == null || s == 'null')
      return '';
    else
      return s;
  }

}
