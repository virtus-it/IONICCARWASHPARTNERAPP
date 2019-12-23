import {ChangeDetectorRef, Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import { TranslateService } from "@ngx-translate/core";
import {AbstractPage} from "../../abstract/abstract";
import {CallWebserviceProvider} from "../../providers/call-webservice/call-webservice";

@IonicPage()
@Component({
  selector: 'page-dealer-car-models',
  templateUrl: 'dealer-car-models.html',
})
export class DealerCarModelsPage extends AbstractPage{
  protected webCallback(json: any, api: any, reqId: any) {
        throw new Error("Method not implemented.");
    }
    protected handleError(json: any, reqId: any) {
        throw new Error("Method not implemented.");
    }

  isPagingEnabled:boolean = true;
  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any = [];
  private noRecords = false;
  private USER_ID;
  private USER_TYPE;
  private isDealer: boolean = true;
  searchInput = {
    "userid":this.USER_ID,
    "searchtext":"",
    "searchtype":"manufacturer",
    "TransType":'searchformodel',
    "apptype":APP_TYPE
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,

              private translateService: TranslateService) {
    super(loadingCtrl, webservice);
                let lang = "en";
    if (UtilsProvider.lang) {
      lang = UtilsProvider.lang
    }
    UtilsProvider.sLog(lang);
    translateService.use(lang);


    this.alertUtils.initUser(this.alertUtils.getUserInfo());

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
            this.fetchList();
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList();
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

    //this.fetchList(false, false, true, "", "");

  }

  doRefresh(refresher) {
    this.event = refresher;
    this.fetchList();

    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    this.event = paging;
    if (this.response) {
      if (this.response.length > 0) {
        this.fetchList(paging);
      }
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

  closeRefresherInfinite(){
    if (this.event) {
      this.alertUtils.showLog(this.event);
      this.event.complete();
    }
  }

  selected(){
    if(this.searchInput.searchtype == 'manufacturer' || this.searchInput.searchtype == 'model'){
      this.searchInput.searchtext = '';
    }
  }

  fetchList(paging?) {
    this.isPagingEnabled = true;
    try {

      let input = {
        "root":{
          "TransType": 'getmodals',
          "usertype":UtilsProvider.USER_TYPE,
          "loginid": this.USER_ID,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      if (paging) {
        this.isPaging = true;
        input.root["lastid"] = this.response[this.response.length - 1].entityid;
      } else {
        this.isPaging = false;
        input.root["lastid"] = '0';
      }

      if(!this.event)
        this.presentLoading();

      this.apiService.postReq(this.apiService.getEntities(),JSON.stringify(input)).then(res=>{
        this.alertUtils.showLog(res);

        this.closeLoading();

        if (res.result == this.alertUtils.RESULT_SUCCESS && res.data) {
          if (!paging)
            this.response = [];

          this.isPagingEnabled = true;

          for (let i = 0; i < res.data.length; i++) {
            res.data[i]['imgUrl'] = this.apiService.getImg()+'product_'+res.data[i].productid+'.png';
            this.response.push(res.data[i]);
          }
        } else {
          if (!paging)
            this.response = [];

          this.isPagingEnabled = false;
        }

        this.closeRefresherInfinite();
        this.alertUtils.showLog(this.response);
      }, error => {
        this.alertUtils.showLog("GET (ERROR)=> PRODUCTS: " + error);
      })

    } catch (e) {
    }finally {
    }
  }

  search(event){

    this.isPagingEnabled = false;

    try {
      if(!this.searchInput.searchtext){
        this.alertUtils.showToast("Please type "+ this.searchInput.searchtype);
        return false;
      }
      let input ={
        "root":this.searchInput
      };

      let data = JSON.stringify(input);
      this.showProgress = true;
      this.apiService.postReq(this.apiService.getEntities(),data).then((res)=>{
        this.showProgress = false;
        this.alertUtils.showLog(res);

        /*this.response = {};
        for (let i = 0; i < res.data.length; i++) {
          res.data[i]['imgUrl'] = this.apiService.getImg()+'product_'+res.data[i].productid+'.png';
          if(res.data.isactive)
            this.response.push(res.data[i]);
        }*/
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.response = res.data;
        }else
          this.alertUtils.showToast("there is details found");
      },(error)=>{

      })
    }catch (e) {
      this.alertUtils.showLog(e);
    }

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

          this.fetchList();

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
                this.fetchList();
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
