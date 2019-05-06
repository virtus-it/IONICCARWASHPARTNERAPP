import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, KEY_USER_INFO, UtilsProvider} from "../../providers/utils/utils";
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
              private platform: Platform,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {
    this.user = this.navParams.get('user');
    this.alertUtils.showLog(this.user);

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchProductList(false, false, true, "", "");
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchProductList(false, false, true, "", "");
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

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
