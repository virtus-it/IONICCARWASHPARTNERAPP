import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-package-create',
  templateUrl: 'dealer-package-create.html',
})
export class DealerPackageCreatePage {

  USER_ID;
  USER_TYPE;
  pageTitle: string;
  buttonTitle: string;
  packages = [];
  products = [];
  vechicleTypes = [];
  categoryList: string[];

  input = {
    packageIDs:'',vehicleID:'',productIDs:''
  };
  output = {"result": "", "actionType": "", "data": ""};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider) {

    this.USER_ID = UtilsProvider.USER_ID;
    this.USER_TYPE = UtilsProvider.USER_TYPE;

    this.pageTitle = 'CREATE PACKAGE';
    this.buttonTitle = 'CREATE';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DealerPackageCreatePage');
    this.getCategories();
    this.fetchVechicleProducts();
  }

  ionSelect(event,vechicle,selectedProducts){
    if(vechicle && vechicle!=null) {
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
      }else
        this.categoryList = [];
    }, error => {

    })
  }

  fetchVechicleProducts() {

    try {
      let url = this.apiService.getProductCategory()+
        UtilsProvider.USER_ID+"/"+
        APP_TYPE+"/"+
        UtilsProvider.USER_TYPE+"/getvechicleproducts";

      this.apiService.getReq(url).then(res=>{
        this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: "+JSON.stringify(res.data));

        if (res && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i];
            element["url"] = this.apiService.getImg() + "package_" + element.categoryid + ".png";
          }
          this.packages = res.data;
        }

      }, error => {
        this.alertUtils.showLog("GET (ERROR)=> PRODUCTS: " + error);
      })

    } catch (e) {
    }

  }

  doValidation(){
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
