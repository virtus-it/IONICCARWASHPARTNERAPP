import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerCustomersPage} from "../dealer-customers/dealer-customers";
import {DealerSuppliersPage} from "../dealer-suppliers/dealer-suppliers";
import {DealerDistributorsPage} from "../dealer-distributors/dealer-distributors";
import {DealerOrdersHomePage} from "../dealer-orders-home/dealer-orders-home";
import { Chart } from 'chart.js';

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

  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('doughnutCanvas2') doughnutCanvas2;

  showProgress    = true;
  doughnutChart: any;

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

        //'{"User":{"TRANSTYPE":"dashboard","usertype":"dealer","userid":"289"}}

        "User": {
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "TRANSTYPE": 'dashboard',
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
        this.response = res.data.DASHBOARDDETAILS;


        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          this.showChart1(
            parseInt(this.response.TOTALBOOKING.totalbookingsdaily),
            parseInt(this.response.TOTALBOOKING.totalbookingsmonthly),
            parseInt(this.response.TOTALBOOKING.totalbookingsyearly));

          this.showChart2(
            parseInt(this.response.CARWASHER.serviceengineersdaily),
            parseInt(this.response.CARWASHER.serviceengineersmonthly),
            parseInt(this.response.CARWASHER.serviceengineersyearly));

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

  openUsers(){
    this.navCtrl.setRoot(DealerCustomersPage);
  }

  openCarWashers(){
    this.navCtrl.setRoot(DealerSuppliersPage);
  }

  openCompanies(){
    this.navCtrl.setRoot(DealerDistributorsPage);
  }

  openBookings(){
    this.navCtrl.setRoot(DealerOrdersHomePage);
  }

  showChart1(val1,val2,val3){
    this.alertUtils.showLog('val1 : '+val1);
    this.alertUtils.showLog('val2 : '+val2);
    this.alertUtils.showLog('val3 : '+val3);
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {

      type: 'doughnut',
      data: {
        labels: ["Today", "This Month", "This Year"],
        datasets: [{
          label: '# of Votes',
          data: [val1,val2,val3],
          backgroundColor: [
            '#b13c2e','#c27d0e','#009abf'
          ],
        }]
      }

    });
  }

  showChart2(val1,val2,val3){
    this.doughnutChart = new Chart(this.doughnutCanvas2.nativeElement, {

      type: 'doughnut',
      data: {
        labels: ["Today", "This Month", "This Year"],
        datasets: [{
          label: '# of Votes',
          data: [val1,val2,val3],
          number: [50],
          // borderColor:['#000000'],
          backgroundColor: [
            '#b13c2e','#c27d0e','#009abf'
          ],
        }]
      }

    });
  }

}
