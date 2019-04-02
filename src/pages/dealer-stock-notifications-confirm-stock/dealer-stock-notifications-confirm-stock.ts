import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-confirm-stock',
  templateUrl: 'dealer-stock-notifications-confirm-stock.html',
})
export class DealerStockNotificationsConfirmStockPage {

  req;
  USER_ID;
  DEALER_PHNO;
  suppliersList:string[];
  contentEditable:boolean = false;
  status:string = '';
  input = {filledCans:'', emptyCans:'', cost:'', totalCost:'',supplierID:'', supplierName:''};
  output = {"result": "", "actionType": "", "data": ""};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private formBuilder: FormBuilder) {

    this.USER_ID = UtilsProvider.USER_ID;
    this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;


    this.req = navParams.get('req');
    this.status = navParams.get('status');

    if(this.req){
      if(this.req.status == 'stockrequested')
        this.contentEditable = true;

      this.input.filledCans = this.req.products[0].stock;
      this.input.emptyCans  = this.req.products[0].returnemptycans;
      this.input.cost       = this.req.products[0].pcost;

      if(this.req.products[0].stock && this.req.products[0].pcost){
        this.input.totalCost = (+this.req.products[0].stock * +this.req.products[0].pcost).toString();
      }else
      this.input.totalCost  = '0';
    }

    if(this.status == 'stockrequested')
    this.getSuppliers();

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  confirm(event){

    try {

      let input = [{
        "product": {
          "reqid": this.req.reqid,
          "status": 'reqconfirm',

          "pid": this.req.products[0].productid,
          "stock": this.input.filledCans,
          "stockid": this.req.reqid,
          "returnemptycans": this.input.emptyCans,
          "paidamt": this.input.totalCost,

          "distributerid": this.req.distributor.userid,
          "dealerid": this.req.dealer.userid,
          "supplierid": this.input.supplierID,
          "suppliername": this.input.supplierName,

          "loginid": this.USER_ID,
          "usertype": UserType.DEALER,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      }]

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.updateStockByDealer(), data).then(res => {
        this.alertUtils.hideLoading();

        this.alertUtils.showLog(res.data);
        this.output.result = res.result;
        this.output.data = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.viewCtrl.dismiss(this.output);
          //this.alertUtils.showToastWithButton("User successfully created", true, 'OK');
        } else
          this.alertUtils.showToastWithButton('Something went wrong\nPlease try again', true, 'OK');

      }, error => {

      })
    }catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  updateCategoryDetails(event, supplier)
  {
    if(supplier){
      this.input.supplierID = supplier.userid;
      this.input.supplierName = supplier.firstname+" "+supplier.lastname;
    }
  }
  getSuppliers(){

    let url = this.apiService.getSuppliers()+UtilsProvider.USER_ID+"/"+APP_TYPE;

    this.alertUtils.showLog(url);

    this.alertUtils.showLoading();
    this.apiService.getReq(url).then(res=>{
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if(res.result == this.alertUtils.RESULT_SUCCESS){
        this.suppliersList = res.data;
      }
    },error=>{

    })
  }


}
