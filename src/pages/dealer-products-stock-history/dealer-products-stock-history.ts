import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, FRAMEWORK, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-products-stock-history',
  templateUrl: 'dealer-products-stock-history.html',
})
export class DealerProductsStockHistoryPage {

  baseImgUrl: string;
  extensionPng: string = '.png';
  showProgress = true;
  product: any;
  output = {"result": "", "actionType": "", "data": ""};
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef) {
    this.product = navParams.get('item');

    this.alertUtils.showLog(this.product);


  }

  ionViewDidLoad() {

    this.fetchList(false, false, true, "", "");

  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "root": {
          "pid": this.product.productid,
          "category": this.product.category,
          "categoryid": this.product.categoryid,
          "brandname": this.product.brandname,
          "last_historyid": '0',
          "pagesize": '10',
          "userid": this.USER_ID,
          "usertype": this.USER_TYPE,
          "framework": FRAMEWORK,
          "apptype": APP_TYPE,

        }
      };


      let data = JSON.stringify(input);


      this.apiService.postReq(this.apiService.getProductStockHistory(), data).then(res => {
        this.hideProgress(isFirst,isRefresh,isPaging, paging, refresher);

        this.alertUtils.showLog(res);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {

          this.response = res.data;

        } else {
          this.noRecords = true;
        }

      }, error => {
        this.alertUtils.hideLoading();
      })
    } catch (e) {
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
}
