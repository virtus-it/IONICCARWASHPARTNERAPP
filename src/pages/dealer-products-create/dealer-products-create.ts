import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {FormBuilder} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-dealer-products-create',
  templateUrl: 'dealer-products-create.html',
})
export class DealerProductsCreatePage {

  USER_ID;
  USER_TYPE;
  DEALER_ID;
  DEALER_PHNO;
  pageTitle: string;
  buttonTitle: string;
  user: any;
  isUpdate: boolean = true;

  categorySelected: boolean = false;
  categoryList: string[];
  categoryProductsList: string[];
  categoryPos: number = -1;

  input = {
    category: "", categoryid: "", currency: "inr", brandname: "", pname: "", ptype: "", pcost: "",
    minorderqty: "", priority: "", iscanreturnable: false, servicecharge: "",
    expressdeliverycharges: "", isauthorized: false
  };
  output = {"result": "", "actionType": "", "data": ""};
  showToast: boolean = true;

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
      this.pageTitle = 'CREATE SERVICE';
      this.buttonTitle = 'CREATE';
    } else {
      this.isUpdate = true;
      this.pageTitle = 'EDIT SERVICE';
      this.buttonTitle = 'UPDATE';

      //updating values
      this.input.pname = this.user.pname;
      this.input.ptype = this.user.ptype;
      this.input.pcost = JSON.stringify(this.user.pcost);
      this.input.brandname = this.user.brandname;
      this.input.categoryid = this.user.categoryid;
      this.input.category = this.user.category;
      this.input.minorderqty = JSON.stringify(this.user.minorderqty);
      this.input.priority = JSON.stringify(this.user.priority);
      this.input.servicecharge = JSON.stringify(this.user.servicecharge);
      this.input.expressdeliverycharges = JSON.stringify(this.user.expressdeliverycharges);
      this.input.iscanreturnable = this.user.iscanreturnable;
      this.input.isauthorized = this.user.isauthorized;

    }

    this.USER_ID = UtilsProvider.USER_ID;
    this.USER_TYPE = UtilsProvider.USER_TYPE;
    this.DEALER_ID = UtilsProvider.USER_DEALER_ID;
    this.DEALER_PHNO = UtilsProvider.USER_DEALER_PHNO;

    this.getCategories();
  }

  isAuthorized() {
    this.input.isauthorized = !this.input.isauthorized;
  }

  isCansReturnble() {
    this.input.iscanreturnable = !this.input.iscanreturnable;
  }

  updateCategoryDetails(event, category) {
    this.input.category = category.category;
    this.input.categoryid = category.categoryid;
    this.categorySelected = true;

    this.getCategoryProducts(category);
  }

  updateProductDetails($event, product) {
    this.input.pname = product.pname;
    this.input.brandname = product.pname;
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  doValidation() {

    this.alertUtils.showLog(JSON.stringify(this.input));

    if (this.alertUtils.validateText(this.input.category, 'Category', 2, 50)) {
      if (this.alertUtils.validateText(this.input.pname, 'Product Name', 3, 50)) {
        if (this.alertUtils.validateText(this.input.ptype, "ProductType", 1, 50)) {
          if (this.alertUtils.validateText(this.input.currency, "Currency", 3, 20)) {
            if (this.alertUtils.validateNumber(this.input.pcost, "Product Cost", 1, 4)) {
              //if (this.alertUtils.validateNumber(this.input.minorderqty, 'Min Order Qty', 1, 3)) {
              if (this.alertUtils.validateNumber(this.input.priority, 'Priority', 1, 3)) {
              // (this.alertUtils.validateNumber(this.input.expressdeliverycharges, 'Express Delivery Charge', 1, 4)) {
                // if (this.alertUtils.validateNumber(this.input.servicecharge, 'Service Charge', 1, 4)) {

                this.showToast = false;

                if (this.isUpdate)
                  this.doUpdate();
                else
                  this.doCreate();
                /* }
               }
             }*/
              }
            }
          }
        }
      }
    }

    if (this.showToast) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }

  }

  doCreate() {
    try {
      let input = {
        "product": {
          "category": this.input.category,
          "categoryid": this.input.categoryid,
          "currency": this.input.currency,
          "brandname": this.input.pname,
          "pname": this.input.pname,
          "ptype": this.input.ptype,
          "pcost": this.input.pcost,
          "minorderqty": this.input.minorderqty,
          "priority": this.input.priority,
          "iscanreturnable": this.input.iscanreturnable,
          "servicecharge": this.input.servicecharge,
          "expressdeliverycharges": this.input.expressdeliverycharges,
          "isauthorized": this.input.isauthorized,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createProduct(), data).then(res => {
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
        "product": {
          "pid": this.user.productid,
          "category": this.input.category,
          "categoryid": this.input.categoryid,
          "currency": this.input.currency,
          "brandname": this.input.pname,
          "pname": this.input.pname,
          "ptype": this.input.ptype,
          "pcost": this.input.pcost,
          "minorderqty": this.input.minorderqty,
          "priority": this.input.priority,
          "iscanreturnable": this.input.iscanreturnable,
          "servicecharge": this.input.servicecharge,
          "expressdeliverycharges": this.input.expressdeliverycharges,
          "isauthorized": this.input.isauthorized,
          "loginid": this.USER_ID,
          "dealer_mobileno": this.DEALER_PHNO,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog('input : ' + data);

      this.alertUtils.showLoading();
      this.apiService.putReq(this.apiService.editProduct(), data).then(res => {
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

  getCategories() {

    let url = this.apiService.getProductCategory() + this.USER_ID + "/" + this.USER_TYPE + "/" + APP_TYPE;

    this.alertUtils.showLog(url);

    this.alertUtils.showLoading();
    this.apiService.getReq(url).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.categoryList = res.data;
      }
    }, error => {

    })
  }

  getCategoryProducts(catDetails: any) {

    let input = {
      "root": {
        "userid": this.USER_ID,
        "usertype": this.USER_TYPE,
        "category": catDetails.category,
        "categoryid": catDetails.categoryid,
        "apptype": APP_TYPE
      }
    };

    let data = JSON.stringify(input);

    this.alertUtils.showLog('input : ' + data);

    this.alertUtils.showLoading();
    this.apiService.postReq(this.apiService.getProductsByCategory(), data).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.categoryProductsList = res.data;
      }
    }, error => {

    })
  }
}
