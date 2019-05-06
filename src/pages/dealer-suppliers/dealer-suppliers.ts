import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  MenuController,
  Platform
} from 'ionic-angular';
import {APP_TYPE, UtilsProvider, UserType, FRAMEWORK, KEY_USER_INFO} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerSupplierCreatePage} from "../dealer-supplier-create/dealer-supplier-create";

@IonicPage()
@Component({
  selector: 'page-dealer-suppliers',
  templateUrl: 'dealer-suppliers.html',
})
export class DealerSuppliersPage {

  from:any;
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;
  searchInput = {
    "userid":this.USER_ID,
    "status":"globalsearch",
    "pagesize":"10",
    "last_orderid":"117",
    "searchtext":"",
    "searchtype":"name",
    "searchfor":"supplier",
    "apptype":APP_TYPE
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private menuCtrl: MenuController,
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.from = this.navParams.get('from');

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchSuppliers(false, false, true, "", "");

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchSuppliers(false, false, true, "", "");

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {

    if(this.from && this.from == 'loginPage'){
      this.menuCtrl.enable(false,'menu1');
      this.menuCtrl.enable(false,'menu2');
      this.menuCtrl.enable(true,'menu3');
      this.menuCtrl.enable(true,'menu4');
      this.menuCtrl.enable(true,'menu5');
    }

  }

  fetchSuppliers(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let url = this.apiService.getSuppliers()+UtilsProvider.USER_ID+"/"+APP_TYPE+"/"+UtilsProvider.USER_TYPE;

      this.alertUtils.showLog(url);

      if (isFirst) {
        this.showProgress = true;
      }

      this.apiService.getReq(url).then(res => {
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog(res.data);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;

          for (let i = 0; i < res.data.length; i++) {


            if (isPaging)
              this.response.push(res.data[i]);
          }
        } else {
          if (!isPaging)
            this.noRecords = true;
        }
        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("GET (ERROR)=> SUPPLIERS: " + error);
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    }
  }

  search(event){

    try {

      let input ={
        "order":this.searchInput
      };

      let data = JSON.stringify(input);
      this.showProgress = true;
      this.apiService.postReq(this.apiService.searchOrders(),data).then((res)=>{
        this.showProgress = false;
        this.alertUtils.showLog(res.data);
        this.response = res.data;
      },(error)=>{

      })
    }catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  validate(s){
    if(s){
      if(s == null || s == 'null')
        return '';
      else
        return s;
    }else
      return '';
  }

  doRefresh(refresher) {
    this.fetchSuppliers(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }


  hideProgress(isFirst, isRefresh, isPaging, paging, refresher) {
    if (isFirst) {
      this.showProgress = false;
    }
    if (isPaging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }
  }

  create(event, user) {
    if (user == '')
      this.alertUtils.showLog('supplier : create');
    else
      this.alertUtils.showLog('supplier : update');
    let model = this.modalCtrl.create('DealerSupplierCreatePage', {
      from: 'supplier',
      item: user,
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          if (data.actionType == 'create')
            this.alertUtils.showToast('User successfully created');
          else
            this.alertUtils.showToast('User successfully updated');

          this.fetchSuppliers(false, false, false, '', '');

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  showPromptForDelete(event, user) {
    let prompt = this.alertCtrl.create({
      title: 'DELETE SERVICE ENGINEER',
      message: 'Are you sure. You want delete service engineer?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Sure',
          handler: data => {
            let input = {
              "User": {
                "TransType": 'deactivate',
                "userid": user.userid,
                "user_type": UserType.SUPPLIER,
                "app_type": APP_TYPE
              }
            };

            let inputData = JSON.stringify(input);
            this.alertUtils.showLog(inputData);

            this.apiService.postReq(this.apiService.createCustomer(), inputData).then(res => {
              this.alertUtils.showLog(res);

              if (res.result == this.alertUtils.RESULT_SUCCESS) {
                this.alertUtils.showToast('User successfully deleted');
                this.fetchSuppliers(false, false, false, '', '');
              }

            });

          }
        }
      ]
    });
    prompt.present();
  }
}
