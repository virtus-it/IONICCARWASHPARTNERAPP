import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-promo-codes',
  templateUrl: 'dealer-promo-codes.html',
})
export class DealerPromoCodesPage {

  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  type:string = 'all';
  filterBy: string = 'filterby';
  startDate='';
  endDate='';


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
            this.fetchList(false,false, true, '','');
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE

            //initial call
            this.fetchList(false,false, true, '','');
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {
    //this.fetchList(false,false, true, '','');
  }



  fetchList( isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input ={

        "offer":{
          "transtype":"getall",
          "type": this.type,
          "userid": this.USER_ID,
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "usertype": this.USER_TYPE,
          "framework":FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };

      if(isPaging)
        input.offer['lastrecord'] = this.response[this.response.lenth-1].offerid;

      if(this.startDate != '')
        input.offer['startdate'] = this.startDate;

      if(this.endDate != '')
        input.offer['enddate'] = this.endDate;

      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getOffers(),data).then(res=>{
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> POINTS: "+JSON.stringify(res));
        this.response = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;


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

  getPointsDetails(event){
    this.showPointsDetails();
  }

  viewHistory(event, result){
    this.navCtrl.push('DealerPointsViewHistoryPage',{
      result:result,
    });
  }

  showPointsDetails() {
    let model = this.modalCtrl.create('DealerPointsDetailsPage', {
    },{
      cssClass: 'dialogcustomstyle',
    })
    model.present();

    model.onDidDismiss(data => {


      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })

  }


  showPromptSearch(event) {
    let prompt = this.alertCtrl.create({
      title: 'FILTERS',
      inputs:[
        {
          label:'Start Date',
          name:'startDate',
          type:'date',
        },
        {
          label:'End Date',
          name:'endDate',
          type:'date',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Apply',
          handler: data => {

            this.alertUtils.showLog(data.startDate);
            this.alertUtils.showLog(data.endDate);


            this.startDate = data.startDate;
            this.endDate = data.endDate;

            if(this.startDate != '' || this.endDate != '')
            this.fetchList(false,false, false, '','');
            else
              this.alertUtils.showToast('Dates required');
          }
        }
      ]
    });
    prompt.present();
  }
}
