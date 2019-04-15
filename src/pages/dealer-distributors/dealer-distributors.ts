import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, MenuController, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerDistributorsCreatePage} from "../dealer-distributors-create/dealer-distributors-create";


@IonicPage()
@Component({
  selector: 'page-dealer-distributors',
  templateUrl: 'dealer-distributors.html',
})
export class DealerDistributorsPage {

  isDealer:any = true;
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {

    if(UtilsProvider.USER_TYPE == UserType.SUPPLIER)
      this.isDealer = false;
    else
      this.isDealer = true;
  }

  ionViewDidLoad() {

    this.fetchList(false, false, true, "", "");

  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "root": {
          "userid": UtilsProvider.USER_DEALER_ID,
          "usertype": UserType.DEALER,
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
      if(UtilsProvider.USER_TYPE == UserType.SUPPLIER){
        input.root['supplierid'] = UtilsProvider.USER_ID;
      }

      this.apiService.postReq(this.apiService.distributors(),JSON.stringify(input)).then(res=>{
        this.alertUtils.showLog(res.data);
        this.response = res.data;
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);

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
        this.alertUtils.showLog("POST (ERROR)=> DISTRIBUTORS: " + error);
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
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

  create(event, user, type) {
    if (user == '')
      this.alertUtils.showLog('customer : create');
    else
      this.alertUtils.showLog('customer : update');

    let model = this.modalCtrl.create('DealerDistributorsCreatePage', {
      from: 'customer',
      item: user,
      type: type,
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
