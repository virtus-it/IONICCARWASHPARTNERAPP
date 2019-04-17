import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";


@IonicPage()
@Component({
  selector: 'page-dealer-pre-orders-cart',
  templateUrl: 'dealer-pre-orders-cart.html',
})
export class DealerPreOrdersCartPage {

  user;
  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any;
  private noRecords = false;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.alertUtils.initUser(this.alertUtils.getUserInfo());
    this.user = this.navParams.get('user');
    this.alertUtils.showLog(this.user);
  }

  ionViewDidLoad() {
    this.fetchProductList(false, false, true, "", "");
  }

  fetchProductList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      this.baseImgUrl = this.apiService.imageDownload()+'product_';

      let url = this.apiService.getProducts()+this.user.dealers.user_id+"/"+APP_TYPE;

      this.alertUtils.showLoading();
      this.apiService.getReq(url).then(res=>{
        this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: "+JSON.stringify(res.data));
        this.response = res.data;


        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {
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

      })

    } catch (e) {
      this.alertUtils.hideLoading();

    }
    this.alertUtils.hideLoading();
  }

}
