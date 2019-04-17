import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, OrderTypes, UtilsProvider} from "../../providers/utils/utils";
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
  order:    any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private formBuilder: FormBuilder) {

    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.order = navParams.get('order');
    this.input.orderid = this.order.order_id;
    this.input.received_amt = this.order.orderamt;
    this.input.adv_amt = this.order.customerpaymentdts.advance_amount;
    this.input.return_cans = this.order.return_cans;
    this.input.empty_cans = '0';
    this.input.delivered_qty = this.order.delivered_quantity;
    this.alertUtils.showLog('Order : ' + JSON.stringify(this.order));

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

    }
  }

}
