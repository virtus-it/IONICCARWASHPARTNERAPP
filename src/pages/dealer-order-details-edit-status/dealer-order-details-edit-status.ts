import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, OrderTypes, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-dealer-order-details-edit-status',
  templateUrl: 'dealer-order-details-edit-status.html',
})
export class DealerOrderDetailsEditStatusPage {

  input = {
    orderStatus: "delivered", orderid: '', paymentype: 'cod', received_amt: '',
    paymentstatus: 'confirm', adv_amt: '', return_cans: '', empty_cans: '',
    delivered_qty: '', product_type: 'cans'
  };
  output = {"result": "", "actionType": "", "data": ""};
  order: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private formBuilder: FormBuilder) {

    try {
      this.alertUtils.initUser(this.alertUtils.getUserInfo());

      this.order = navParams.get('order');
      if (this.order) {
        if (this.order.order_id)
          this.input.orderid = this.order.order_id;
        if (this.order.orderamt)
          this.input.received_amt = this.order.orderamt;
        if (this.order && this.order.customerpaymentdts && this.order.customerpaymentdts.advance_amount)
          this.input.adv_amt = this.order.customerpaymentdts.advance_amount;
        else
          this.input.adv_amt = '0';
        if (this.order.return_cans)
          this.input.return_cans = this.order.return_cans;
        else
          this.input.return_cans = '0';

        this.input.empty_cans = '0';
        if (this.order.delivered_quantity)
          this.input.delivered_qty = this.order.delivered_quantity;
        this.alertUtils.showLog(this.order);
      }
    } catch (e) {
      console.log(e);
    }

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }


  closeModal() {
    this.viewCtrl.dismiss();
  }

  submitOrder(event) {
    try {
      let input = {
        "order": {
          "orderid": this.input.orderid,
          "orderstatus": this.input.orderStatus,
          "paymentype": this.input.paymentype,
          "paymentstatus": this.input.paymentstatus,
          "received_amt": this.input.received_amt,
          "adv_amt": this.input.adv_amt,
          "return_cans": this.input.return_cans,
          "empty_cans": this.input.empty_cans,
          "delivered_qty": this.input.delivered_qty,
          "product_type": this.input.product_type,
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "loginid": UtilsProvider.USER_ID,
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "dealer_mobileno": UtilsProvider.USER_DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.orderDelivered(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog('Order : Delivered');
        this.alertUtils.showLog(JSON.stringify(res));

        this.output.result = res.result;
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          this.alertUtils.stopSubscription();
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');
      }, error => {

      })
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

}
