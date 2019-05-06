import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-customers',
  templateUrl: 'dealer-customers.html',
})
export class DealerCustomersPage {

  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID ;
  private USER_TYPE;
  searchInput = {
    "userid":this.USER_ID,
    "status":"globalsearch",
    "pagesize":"10",
    "last_orderid":"117",
    "searchtext":"",
    "searchtype":"name",
    "searchfor":"customer",
    "apptype":APP_TYPE
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {


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
            this.fetchCustomers(false, false, true, "", "");
          }
        }, (error) => {
          UtilsProvider.USER_INFO
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  ionViewDidLoad() {


  }

  fetchCustomers(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let last_customer_id = '0';

      if (isPaging)
        last_customer_id = this.response[this.response.length - 1].userid;

      let url = this.apiService.getCustomers() + this.USER_ID + "/" + last_customer_id + "/" + APP_TYPE + "/" + this.USER_TYPE;

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
        this.alertUtils.showLog("GET (ERROR)=> CUSTOMERS: " + error);
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
    this.fetchCustomers(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchCustomers(true, false, false, paging, "");
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
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

  createCustomer(event, user) {
    if (user == '')
      this.alertUtils.showLog('customer : create');
    else
      this.alertUtils.showLog('customer : update');
    let model = this.modalCtrl.create('DealerCustomersCreatePage', {
      from: 'customer',
      item: user,
      payments: user.payments,
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          if (data.actionType == 'create')
            this.alertUtils.showToast('User successfully created');
          else
            this.alertUtils.showToast('User successfully updated');

          this.fetchCustomers(false, false, false, '', '');

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  showPromptForDeleteCustomer(event, user) {
    this.alertUtils.showLog('delete user clicked');
    let prompt = this.alertCtrl.create({
      title: 'DELETE CUSTOMER',
      message: 'Are you sure. You want delete customer?',
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
                "user_type": UserType.CUSTOMER,
                "app_type": APP_TYPE
              }
            };

            let inputData = JSON.stringify(input);
            this.alertUtils.showLog(inputData);

            this.apiService.postReq(this.apiService.createCustomer(), inputData).then(res => {
              this.alertUtils.showLog(res);

              if (res.result == this.alertUtils.RESULT_SUCCESS) {
                this.alertUtils.showToast('User successfully deleted');
                this.fetchCustomers(false, false, false, '', '');
              }

            });

          }
        }
      ]
    });
    prompt.present();
  }

}
