import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";

@IonicPage()
@Component({
  selector: 'page-dealer-dash-board',
  templateUrl: 'dealer-dash-board.html',
})
export class DealerDashBoardPage {

  private response: any = [];
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  showProgress    = true;

  output ={totalOrders:'', pendingOrders: '', completedOrders:'',
    totalPayments:'', codPayments:'', creditPayments:'',
    totalCustomers:'', totalDistributors:'', totalSuppliers:''};



  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef) {

  }

  ionViewDidLoad() {
    this.fetchData(false, false, true, '', '');
  }


  fetchData(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let d = new Date();

      let input = {

        "root": {
          "user_id": this.USER_ID,
          "user_type": this.USER_TYPE,
          "transtype": 'allorderscount',
          "fromdate": UtilsProvider.formatDateToYYYYMMDD(d.setDate(d.getDate()-30)),
          "todate": UtilsProvider.formatDateToYYYYMMDD(new Date().toISOString()),
          "dealerid": UtilsProvider.USER_DEALER_ID,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,
        }
      };


      let data = JSON.stringify(input);

      this.alertUtils.showLog(data);

      this.apiService.postReq(this.apiService.getDashboard(), data).then(res => {
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> DASHBOARD: " + JSON.stringify(res));
        this.response = res.data;


        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          //orders
          this.output.totalOrders     = this.response.vallordercount;
          this.output.pendingOrders   = this.response.vpendingordercount;
          this.output.completedOrders = this.response.vdeliverordercount;

          if(this.output.totalOrders == '')
            this.output.pendingOrders = '0';

          if(this.output.pendingOrders == '')
            this.output.pendingOrders = '0';

          if(this.output.pendingOrders == '')
            this.output.pendingOrders = '0';

          //payments
          this.output.totalPayments     = JSON.stringify(this.response.vtotal_payments);
          this.output.codPayments       = JSON.stringify(this.response.vcod_payments);
          this.output.creditPayments    = JSON.stringify(this.response.vcredit_payments);

          if(this.output.totalPayments == '')
            this.output.totalPayments = '0';

          if(this.output.codPayments == '')
            this.output.codPayments = '0';

          if(this.output.creditPayments == '')
            this.output.creditPayments = '0';

          //users
          this.output.totalCustomers      = this.response.vtotalcustomers;
          this.output.totalDistributors   = this.response.vtotaldistributor;
          this.output.totalSuppliers      = this.response.vtotalsuppliers;

          if(this.output.totalCustomers == '')
            this.output.totalCustomers = '0';

          if(this.output.totalDistributors == '')
            this.output.totalDistributors = '0';

          if(this.output.totalSuppliers == '')
            this.output.totalSuppliers = '0';

          this.alertUtils.showLog("result : "+JSON.stringify(this.output));

        }
        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> FEEDBACKS: " + error);
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      })

    } catch (e) {
      this.alertUtils.hideLoading();
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
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

}
