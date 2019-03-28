import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerPointsDetailsPage} from "../dealer-points-details/dealer-points-details";
import {DealerPointsSearchPage} from "../dealer-points-search/dealer-points-search";
import {DealerPointsViewHistoryPage} from "../dealer-points-view-history/dealer-points-view-history";


@IonicPage()
@Component({
  selector: 'page-dealer-points',
  templateUrl: 'dealer-points.html',
})
export class DealerPointsPage {

  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  type:string = 'all';
  filterBy: string = 'filterby';


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.fetchList(false,false, true, '','');
  }



  fetchList( isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input ={

        "User":{
          "TransType":"getallpoints",
          "type": this.type,
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "framework":FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };

      if(this.filterBy != '')
        input.User['filterby'] = this.filterBy;

      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getPoints(),data).then(res=>{
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> POINTS: "+JSON.stringify(res));
        this.response = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {

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

  getPointsDetails(event){
    this.showPointsDetails();
  }

  viewHistory(event, result){
    let user = {userID:result.userid, userName:result.user_name,
    userPhno:result.user_phno, userType:result.user_type};

    this.navCtrl.push('DealerPointsViewHistoryPage',{
      result:user,
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

  showPointsSearch(event) {
    let model = this.modalCtrl.create('DealerPointsSearchPage', {
    },{
      cssClass: 'dialogcustomstyle',
    })
    model.present();

    model.onDidDismiss(data => {

      if (data) {
        this.alertUtils.showLog(data);
        this.type = data.userType;
        this.filterBy = data.filterBy;

        this.fetchList(false,false, false, '','');
      }
    })
  }

}
