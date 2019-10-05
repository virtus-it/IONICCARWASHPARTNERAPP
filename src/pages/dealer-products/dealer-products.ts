import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {APP_TYPE, KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-dealer-products',
  templateUrl: 'dealer-products.html',
})
export class DealerProductsPage {


  baseImgUrl: string;
  extensionPng: string = '.png';
  showProgress = true;
  imgUrl: string;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;
  private categoryItem: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private platform: Platform,
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
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
            this.USER_TYPE = UtilsProvider.USER_TYPE;

            //initial call
            this.fetchList(false, false, true, "", "");
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO;
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.USER_ID = UtilsProvider.USER_ID;
            this.USER_TYPE = UtilsProvider.USER_TYPE;

            //initial call
            this.fetchList(false, false, true, "", "");
          }
        });

        this.categoryItem = this.navParams.get('item');
        console.log(this.categoryItem);
        if (this.categoryItem)
          this.getProducts(this.categoryItem,'');

      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewDidLoad() {

    // this.fetchList(false, false, true, "", "");

  }

  assetImg(item) {
    item.imgUrl = 'assets/imgs/img_user.png';
  }

  getProducts(item,refresher) {
    try {
      let input = {
        "root": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UtilsProvider.USER_TYPE,
          "category": item.category,
          "categoryid": item.categoryid,
          "apptype": APP_TYPE
        }
      };
      let data = JSON.stringify(input);
      this.alertUtils.showLog('input : ' + data);
      this.showProgress = true;
      this.apiService.postReq(this.apiService.getProductsByCategory(), data).then(res => {
        this.showProgress = false;
        if(refresher){
          refresher.complete();
        }
        this.alertUtils.showLog(res);
        if (res.result == this.alertUtils.RESULT_SUCCESS && res.data) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i]['imgUrl'] = this.apiService.getImg() + 'product_' + res.data[i].productid + '.png';
          }
          this.response = res.data;
        }
      }, error => {
        this.alertUtils.showLog(error);
        this.showProgress = false;
        if(refresher){
          refresher.complete();
        }
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {

    // try {
    //
    //   this.baseImgUrl = this.apiService.imageDownload()+'product_';
    //
    //   let url = this.apiService.getProducts()+UtilsProvider.USER_ID+"/"+APP_TYPE+"/"+UtilsProvider.USER_TYPE;
    //
    //   this.apiService.getReq(url).then(res=>{
    //     this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: "+JSON.stringify(res.data));
    //     this.alertUtils.showLog(res);
    //     this.response = res.data;
    //     this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);
    //
    //     if (res.result == this.alertUtils.RESULT_SUCCESS) {
    //       this.noRecords = false;
    //
    //       for (let i = 0; i < res.data.length; i++) {
    //         res.data[i]['imgUrl'] = this.apiService.getImg()+'product_'+res.data[i].productid+'.png';
    //         if(res.data.isactive)
    //           this.response.push(res.data[i]);
    //
    //       }
    //     } else {
    //       if (!isPaging)
    //         this.noRecords = true;
    //     }
    //     this.ref.detectChanges();
    //   }, error => {
    //     this.alertUtils.showLog("GET (ERROR)=> PRODUCTS: " + error);
    //     this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    //   })
    //
    // } catch (e) {
    //   this.alertUtils.hideLoading();
    //   this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    // }
  }

  doRefresh(refresher) {
    // this.fetchList(false, true, false, "", refresher);
      this.getProducts(this.categoryItem,refresher);
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

  callStockHistoryView(event, product) {
    // this.navCtrl.push(DealerProductsStockHistoryPage, {
    // item:product
    // });
  }

  create(event, user) {
    if (user == '')
      this.alertUtils.showLog('product : create');
    else
      this.alertUtils.showLog('product : update');

    let model = this.modalCtrl.create('DealerProductsCreatePage', {
      from: 'customer',
      item: user,
      categoryitem:this.categoryItem,
      payments: user.payments,
    }, {
      cssClass: 'dialogcustomstyle',
    });
    model.present();

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          this.getProducts(this.categoryItem,'');

          if (data.actionType == 'create')
            this.alertUtils.showToast('User successfully created');
          else
            this.alertUtils.showToast('User successfully updated');

          this.fetchList(false, false, false, '', '');

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })

  }

  showPromptForDelete(event, user) {
    let prompt = this.alertCtrl.create({
      title: 'DELETE SERVICE',
      message: 'Are you sure. You want delete service?',
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
              "product": {
                //"TransType": 'deactivate',
                "pid": user.productid,
                "userid": this.USER_ID,
                "loginid": this.USER_ID,
                "user_type": UserType.DEALER,
                "app_type": APP_TYPE
              }
            };

            let inputData = JSON.stringify(input);
            this.alertUtils.showLog(inputData);

            this.alertUtils.showLoading();
            this.apiService.postReq(this.apiService.removeProduct(), inputData).then(res => {
              this.alertUtils.showLog(res);
              this.alertUtils.hideLoading();

              if (res.result == this.alertUtils.RESULT_SUCCESS) {
                this.alertUtils.showToast('Product successfully deleted');
                this.fetchList(false, false, false, '', '');
              }

            });

          }
        }
      ]
    });
    prompt.present();
  }

  get() {
    return new Date();
  }

  showPromptForAddStock(event, product) {
    let prompt = this.alertCtrl.create({
      title: 'ADD STOCK',
      inputs: [
        {
          name: 'invoiceDate',
          placeholder: 'Invoice Date',
          type: "text",
          value: '2019-03-27'
        },
        {
          name: 'stockQty',
          placeholder: 'Stock/Quantity',
          type: "number"
        },
        {
          name: 'eachItemCost',
          placeholder: 'Each Item Cost',
          type: "number"
        },
        {
          name: 'paidAmt',
          placeholder: 'Paid Amount',
          type: "number",
        },
        {
          name: 'returnCans',
          placeholder: 'Return Cans',
          type: "number"
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Sure',
          handler: data => {

            let b = false;

            if (this.alertUtils.validateNumber(data.stockQty, 'Stock required', 1, 4)) {
              if (this.alertUtils.validateNumber(data.eachItemCost, 'Each Product Cost', 1, 4)) {
                if (this.alertUtils.validateNumber(data.paidAmt, 'Paid Amount', 1, 5)) {
                  if (this.alertUtils.validateNumber(data.returnCans, 'Return Cans', 1, 5)) {
                    b = true;
                  } else {
                    this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                    return false;
                  }
                } else {
                  this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                  return false;
                }
              } else {
                this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                return false;
              }
            } else {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
              return false;
            }


            if (b) {

              let input = {
                "product": {
                  "pid": product.productid,
                  "stock": data.stockQty,
                  "itemcost": data.eachItemCost,
                  "invoicedate": data.invoiceDate,
                  "invoicenumber": '12344321',
                  "returnemptycans": data.returnCans,
                  "userid": this.USER_ID,
                  "loginid": this.USER_ID,
                  "user_type": UserType.DEALER,
                  "app_type": APP_TYPE
                }
              };

              let inputArray = [];
              inputArray.push(input);
              let inputData = JSON.stringify(inputArray);
              this.alertUtils.showLog(inputData);

              this.alertUtils.showLoading();
              this.apiService.postReq(this.apiService.setmAddStock(), inputData).then(res => {
                this.alertUtils.showLog(res);
                this.alertUtils.hideLoading();

                if (res.result == this.alertUtils.RESULT_SUCCESS) {
                  this.alertUtils.showToast('Stock successfully added');
                  this.fetchList(false, false, false, '', '');
                }

              });

            }
          }
        }
      ]
    });
    prompt.present();
  }
}
