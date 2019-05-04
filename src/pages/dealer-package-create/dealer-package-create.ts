import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-package-create',
  templateUrl: 'dealer-package-create.html',
})
export class DealerPackageCreatePage {

  USER_ID;
  USER_TYPE;
  package: any;
  pageTitle: string;
  buttonTitle: string;
  packages = [];
  products = [];
  vechicleTypes = [];
  categoryList: string[];
  isUpdate: boolean = false;

  input = {
    vehicleID: '', productIDs: []
  };
  output = {"result": "", "actionType": "", "data": ""};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider) {

    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    this.USER_ID = UtilsProvider.USER_ID;
    this.USER_TYPE = UtilsProvider.USER_TYPE;

    this.package = navParams.get('data');
    this.alertUtils.showLog(this.package);

    if (this.package && this.package != null) {
      this.isUpdate = true;
      this.pageTitle = 'UPDATE PACKAGE';
      this.buttonTitle = 'UPDATE';
      this.input.vehicleID = this.package.vehicleid;
      this.input.productIDs = JSON.parse(this.package.products);
      this.alertUtils.showLog(this.package.vehicleid);
      this.alertUtils.showLog(this.package.products);
      this.alertUtils.showLog(this.input.productIDs);
      this.alertUtils.showLog("this.input.productIDs : " + this.input.productIDs);
    } else {
      this.pageTitle = 'CREATE PACKAGE';
      this.buttonTitle = 'CREATE';
    }

    this.getCategories();
    this.fetchVechicleProducts();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerPackageCreatePage');
  }

  ionSelect(event, vechicle, selectedProducts) {
    if (vechicle && vechicle != null) {
      this.input.vehicleID = vechicle.id;
      this.products = selectedProducts.products;
      this.alertUtils.showLog(this.products);
    }
  }

  getCategories() {

    this.categoryList = []
    let url = this.apiService.getProductCategory() + this.USER_ID + "/" + this.USER_TYPE + "/" + APP_TYPE;

    this.alertUtils.showLog(url);

    this.alertUtils.showLoading();
    this.apiService.getReq(url).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.categoryList = res.data;
        this.vechicleTypes = res.data[0].VEHICLE;
      } else
        this.categoryList = [];
    }, error => {

    })
  }

  fetchVechicleProducts() {

    try {
      let url = this.apiService.getProductCategory() +
        UtilsProvider.USER_ID + "/" +
        APP_TYPE + "/" +
        UtilsProvider.USER_TYPE + "/getvechicleproducts";

      this.apiService.getReq(url).then(res => {
        this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: " + JSON.stringify(res.data));

        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            element["url"] = this.apiService.getImg() + "package_" + element.categoryid + ".png";
          }
          this.packages = res.data;
          if (this.package) {
            let vehicle = +this.input.vehicleID - 1;
            this.products = this.packages[vehicle].products;
            this.alertUtils.showLog(this.products);
          }
        }

      }, error => {
        this.alertUtils.showLog("GET (ERROR)=> PRODUCTS: " + error);
      })

    } catch (e) {
    }

  }

  doValidation() {
    if (this.isUpdate)
      this.doUpdate();
    else
      this.doCreate();
  }

  doCreate() {
    try {

      let input = {
        "product": {
          "transtype": "createpackage",
          "cdesc": this.input.productIDs,
          "vehicleid": this.input.vehicleID,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createCategory(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        this.alertUtils.showLog(res.data);

        this.output.result = res.result;
        this.output.actionType = 'create';
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

  doUpdate() {
    try {

      let input = {
        "product": {
          "transtype": "updatepackage",
          "categoryid": this.package.categoryid,
          "cdesc": this.input.productIDs,
          "vehicleid": this.input.vehicleID,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.createCategory(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
