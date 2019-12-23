import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-dealer-users-customercare',
  templateUrl: 'dealer-users-customercare.html',
})
export class DealerUsersCustomercarePage {

  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;
  private isDealer: boolean = true;

  searchInput = {
    "userid":this.USER_ID,
    "status":"globalsearch",
    "pagesize":"10",
    "last_orderid":"117",
    "searchtext":"",
    "searchtype":"name",
    "searchfor":"users",
    "apptype":APP_TYPE
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {

    try {
      this.platform.ready().then(ready => {
        let lang = "en";
                if (UtilsProvider.lang) {
                  lang = UtilsProvider.lang
                }
                UtilsProvider.sLog(lang);
                translateService.use(lang);
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList(false, false, true, "", "");

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList(false, false, true, "", "");

          }
        });
      });

      if(UtilsProvider.ISSUPER_DEALER){
        this.isDealer = true;
      }else{
        this.isDealer = false;
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {


  }

  selected(){
    if(this.searchInput.searchtype == 'name' || this.searchInput.searchtype == 'mobile' )
      this.searchInput.searchtext = '';
  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "root": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "transtype":"getall",
          "loginid": UtilsProvider.USER_ID,
          "lastuserid": '0',
          "apptype": APP_TYPE,
        }
      };


      let last_userid_id = '0';

      if (isPaging)
        last_userid_id = this.response[this.response.length - 1].userid;

      if (isFirst) {
        this.showProgress = true;
      }

      input.root['lastuserid'] = last_userid_id;

      this.apiService.postReq(this.apiService.distributors(),JSON.stringify(input)).then(res=>{
        this.alertUtils.showLog(res);

        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.response = res.data;

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
        this.alertUtils.showLog("POST (ERROR)=> DISTRIBUTORS: " + error);
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

  doRefresh(refresher) {
    this.fetchList(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchList(true, false, false, paging, "");
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

  create(event, user) {
    if (user == '')
      this.alertUtils.showLog('customer : create');
    else
      this.alertUtils.showLog('customer : update');

    let model = this.modalCtrl.create('DealerUsersCustomercareCreatePage', {
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

          this.fetchList(false, false, false, '', '');

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  showPromptForDelete(event, user) {
    let prompt = this.alertCtrl.create({
      title: 'DELETE VENDOR',
      message: 'Are you sure. You want delete vendor?',
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
                "user_type": UserType.DEALER,
                "app_type": APP_TYPE
              }
            };

            let inputData = JSON.stringify(input);
            this.alertUtils.showLog(inputData);

            this.apiService.postReq(this.apiService.createCustomer(), inputData).then(res => {
              this.alertUtils.showLog(res);

              if (res.result == this.alertUtils.RESULT_SUCCESS) {
                this.alertUtils.showToast('User successfully deleted');
                this.fetchList(false, false, false, '', '');
              }

            });

          }
        }
      ]
    });
    prompt.present();
  }
}
