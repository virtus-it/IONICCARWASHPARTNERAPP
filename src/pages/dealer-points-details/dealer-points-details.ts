import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-points-details',
  templateUrl: 'dealer-points-details.html',
})
export class DealerPointsDetailsPage {

  response:any;
  pageTitle:string = 'POINTS DETAILS';
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private platform: Platform,
              private ref: ChangeDetectorRef) {
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

  dismiss(){
    this.navCtrl.pop();
  }

  ionViewDidLoad() {

    //this.fetchList(false, false, true, "", "");

  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input ={
        "User":{
          "TransType":"getpointsmst",
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,

        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.getPoints(),data).then(res=>{
        this.alertUtils.hideLoading();
        this.alertUtils.showLog("POST (SUCCESS)=> POINTS: "+JSON.stringify(res));
        this.response = res.data;

        if (res.result == this.alertUtils.RESULT_SUCCESS) {

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
        this.alertUtils.hideLoading();
      })

    } catch (e) {
      this.alertUtils.hideLoading();
    }
  }

  getActiveStatus(s):any{
    if(s == 1)
      return 'ACTIVE';
    else
      return 'EXPIRED';
  }

}
