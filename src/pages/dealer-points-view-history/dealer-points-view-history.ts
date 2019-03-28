import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-points-view-history',
  templateUrl: 'dealer-points-view-history.html',
})
export class DealerPointsViewHistoryPage {


  showProgress = true;
  output1;
  output2;
  totalPoints:string = '';
  USER_ID;
  USER_TYPE;
  pageTitle = 'VIEW POINTS';

  userDetails:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef) {

    try {
      this.userDetails = navParams.get('result');
      this.USER_ID = this.userDetails.userid;
      this.USER_TYPE = this.userDetails.user_type;
    }catch (e) {
      this.alertUtils.showLog("ERROR : getting values from called page");
    }
  }

  ionViewDidLoad() {
    this.fetchData1(false,false, true, '','');
  }



  fetchData1( isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input ={

        "User":{
          "TransType":"getpoints",
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "framework":FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getPoints(),data).then(res=>{
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> POINTS: "+JSON.stringify(res));
        this.output1 = res.data;

        this.alertUtils.showLog('output1 : >> '+JSON.stringify(this.output1));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          //this.noRecords = false;

          this.totalPoints = this.output1.totalpoints;

          for (let i = 0; i < res.data.length; i++) {

          }
        } else {
          if (!isPaging)
            {

            }
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

    this.fetchData2(false,false,false,'','');
  }

  fetchData2( isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input ={

        "User":{
          "TransType":"getpointsdetails",
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "framework":FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getPoints(),data).then(res=>{
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> POINTS: "+JSON.stringify(res));
        this.output2 = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          //this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {

          }
        } else {
          if (!isPaging)
          {

          }
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
    this.fetchData1(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.output1) {
      if (this.output1.length > 0)
        this.fetchData1(true, false, false, paging, "");
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

}
