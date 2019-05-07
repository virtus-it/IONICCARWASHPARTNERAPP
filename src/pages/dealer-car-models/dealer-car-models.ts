import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-car-models',
  templateUrl: 'dealer-car-models.html',
})
export class DealerCarModelsPage {

  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID;
  private USER_TYPE;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());

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
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  ionViewDidLoad() {

    //this.fetchList(false, false, true, "", "");

  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "root":{
          /*usertype:"customer",*/
          "TransType": 'getmodals',
          "usertype":UtilsProvider.USER_TYPE,
          "loginid": this.USER_ID,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      this.apiService.postReq(this.apiService.getEntities(),JSON.stringify(input)).then(res=>{
        this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: "+JSON.stringify(res.data));
        this.alertUtils.showLog(res);
        this.response = res.data;
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {
            res.data[i]['imgUrl'] = this.apiService.getImg()+'product_'+res.data[i].productid+'.png';
            if(res.data.isactive)
              this.response.push(res.data[i]);

          }
        } else {
          if (!isPaging)
            this.noRecords = true;
        }
        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("GET (ERROR)=> PRODUCTS: " + error);
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


  create(event, car) {
    if (car == '')
      this.alertUtils.showLog('car-model : create');
    else
      this.alertUtils.showLog('car-model : update');

    let model = this.modalCtrl.create('DealerCarModelsCreatePage', {
      from: 'carmodel',
      item: car,
    },{
      cssClass: 'dialogcustomstyle',
    })
    model.present();

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          if (data.actionType == 'create')
            this.alertUtils.showToast('Car Model successfully created');
          else
            this.alertUtils.showToast('Car Model successfully updated');

          this.fetchList(false, false, false, '', '');

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })

  }

  showPromptForDelete(event, car) {
    let prompt = this.alertCtrl.create({
      title: 'DELETE MODEL',
      message: 'Are you sure. You want delete model?',
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
              "root": {
                "TransType": 'deletemodal',
                "entityid": car.entityid,
                "loginid": this.USER_ID,
                "framework": FRAMEWORK,
                "apptype": APP_TYPE
              }
            };

            let inputData = JSON.stringify(input);
            this.alertUtils.showLog(inputData);

            this.alertUtils.showLoading();
            this.apiService.postReq(this.apiService.getEntities(), inputData).then(res => {
              this.alertUtils.showLog(res);
              this.alertUtils.hideLoading();

              if (res.result == this.alertUtils.RESULT_SUCCESS) {
                this.alertUtils.showToast('Model successfully deleted');
                this.fetchList(false, false, false, '', '');
              }

            });

          }
        }
      ]
    });
    prompt.present();
  }

  get(){
    return new Date();
  }

}
