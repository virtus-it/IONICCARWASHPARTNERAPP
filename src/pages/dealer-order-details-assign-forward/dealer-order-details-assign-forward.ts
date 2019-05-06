import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-dealer-order-details-assign-forward',
  templateUrl: 'dealer-order-details-assign-forward.html',
})
export class DealerOrderDetailsAssignForwardPage {
  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string = 'ASSIGN';
  user: any;
  isUpdate: boolean = true;
  selectedValue;
  input = {
    firstname: "", lastname: "", phno1: "", email: "", phno2: "", phno3: "", platNo: "",
    locality: "", addr: "", advAmt: "", paymentType: "cod", customerType: "residential"
  };

  output = {"result": "", "actionType": "", "data": ""};
  segmentSelected: string = 'suppliers';
  suppliersList: string[];
  distributorsList: string[];
  mainList = [];
  item: any;
  orderInfo: any;


  showToast: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private formBuilder: FormBuilder) {

    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.orderInfo = navParams.get('orderInfo');
    this.suppliersList = navParams.get('suppliersList');
    this.distributorsList = navParams.get('distributorsList');

    this.mainList = this.suppliersList;

    this.alertUtils.showLog("Order Details: " + JSON.stringify(this.orderInfo));

    /*this.alertUtils.showLog("List: Suppliers: " + this.suppliersList);
    this.alertUtils.showLog("List: Distributors: " + JSON.stringify(this.distributorsList));
    this.alertUtils.showLog("List: MainList: " + this.mainList);*/

    alertUtils.showLog(this.user);



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

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);

    this.selectedValue = '';

    if (ev._value == 'suppliers') {
      this.buttonTitle = 'ASSIGN';
      this.mainList = this.suppliersList;
    } else {
      this.buttonTitle = 'FORWARD';
      this.mainList = this.distributorsList;
    }
  }

  doValidation(event) {

    if (this.selectedValue != '') {
      if (this.buttonTitle == 'ASSIGN') {
        this.doAssign();
      } else if (this.buttonTitle == 'FORWARD') {
        this.doForward();
      }
    } else {
      if (this.buttonTitle == 'ASSIGN') {
        this.alertUtils.showToast('Select any supplier');
      } else if (this.buttonTitle == 'FORWARD') {
        this.alertUtils.showToast('Select any distributor');
      }
    }

  }

  doAssign() {
    try {
      let input = {
        "order": {
          "orderid": this.orderInfo.order_id,
          "to": this.selectedValue.userid,
          "from": this.DEALER_ID,
          "orderfrom": this.orderInfo.order_id,
          "orderstatus": OrderTypes.ASSIGNED,
          /*"autoassign":true,
          "supplierID": this.input.phno3,
          "supplierName": this.input.email,
          "supplierMno": 'paani',*/
          "autoassign": false,
          "quantity": this.orderInfo.quantity,
          "product_type": this.orderInfo.prod_type,
          "product_name": this.orderInfo.brandname,
          "usertype": this.USER_TYPE,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.assignOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog('Order : Assign');
        this.alertUtils.showLog(JSON.stringify(res));

        this.output.result = res.result;
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.output.actionType = 'assign';
          this.viewCtrl.dismiss(this.output);
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {

      })
    } catch (e) {

    }
  }

  doForward() {
    try {

      let input = {
        "order": {
          "orderid": this.orderInfo.order_id,
          "to": this.orderInfo.dealerdetails.userid,
          "from": this.DEALER_ID,
          "orderto": this.DEALER_ID,
          "orderstatus": OrderTypes.ORDERED,
          "quantity": this.orderInfo.quantity,

          "productid": this.orderInfo.prod_id,
          "product_name": this.orderInfo.brandname,
          "product_type": this.orderInfo.prod_type,
          "product_cost": this.orderInfo.prod_cost,
          "servicecharges": 10,
          "expressdeliverycharges": 15,

          "usertype": this.USER_TYPE,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.forwardOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog('Order : Forward');
        this.alertUtils.showLog(JSON.stringify(res));

        /*this.output.result = res.result;
        this.output.actionType = 'create';
        this.output.data = res.data;
*/
        /*if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
*/
      }, error => {

      })
    } catch (e) {

    }
  }
}
