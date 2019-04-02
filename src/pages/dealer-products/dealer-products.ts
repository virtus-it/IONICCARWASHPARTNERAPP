import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, UserType, UtilsProvider} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {DealerProductsStockHistoryPage} from "../dealer-products-stock-history/dealer-products-stock-history";

@IonicPage()
@Component({
  selector: 'page-dealer-products',
  templateUrl: 'dealer-products.html',
})
export class DealerProductsPage {

  baseImgUrl:string;
  extensionPng:string='.png';
  showProgress = true;
  private response: any;
  private noRecords = false;
  private USER_ID = UtilsProvider.USER_ID;
  private USER_TYPE = UtilsProvider.USER_TYPE;
  output: Map<string, any> = new Map<string, any>();
  keys = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private ref: ChangeDetectorRef,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {

    this.fetchList(false, false, true, "", "");

  }

  fetchList(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      this.baseImgUrl = this.apiService.imageDownload()+'product_';

      let url = this.apiService.getProducts()+UtilsProvider.USER_ID+"/"+APP_TYPE;

      this.apiService.getReq(url).then(res=>{
        this.alertUtils.showLog("GET (SUCCESS)=> PRODUCTS: "+JSON.stringify(res.data));
        this.hideProgress(isFirst,isRefresh,isPaging,paging,refresher);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          for (let i = 0; i < res.data.length; i++) {
            if(res.data.isactive = '1') {
              let brandName = res.data[i].brandname+res.data[i].category;

              this.alertUtils.showLog('BrandName : '+brandName);

              if(this.output.has(brandName)){
                this.alertUtils.showLog('IN MAP : Found brandname');
                this.output.get(brandName)[this.output.size] = res.data[i];
              }else {
                this.alertUtils.showLog('IN MAP : Not Found brandname');
                this.output.set(brandName,res.data[i]);
              }

            }

          }

          this.keys = Array.from(this.output.keys());

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

  callStockHistoryView(event, product){
    this.navCtrl.push(DealerProductsStockHistoryPage, {
      item:product
    });
  }

  create(event, user) {
    if (user == '')
      this.alertUtils.showLog('product : create');
    else
      this.alertUtils.showLog('product : update');

    let model = this.modalCtrl.create('DealerProductsCreatePage', {
      from: 'customer',
      item: user,
      payments: user.payments,
    },{
      cssClass: 'dialogcustomstyle',
    })
    model.present();

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
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
      title: 'DELETE PRODUCT',
      message: 'Are you sure. You want delete product?',
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

  get(){
    return new Date();
  }

  showPromptForAddStock(event, product) {
    let prompt = this.alertCtrl.create({
      title: 'ADD STOCK',
      inputs:[
        {
          name:'invoiceDate',
          placeholder:'Invoice Date',
          type: "text",
          value: '2019-03-27'
        },
        {
          name:'stockQty',
          placeholder:'Stock/Quantity',
          type: "number"
        },
        {
          name:'eachItemCost',
          placeholder:'Each Item Cost',
          type:"number"
        },
        {
          name:'paidAmt',
          placeholder:'Paid Amount',
          type:"number",
        },
        {
          name:'returnCans',
          placeholder:'Return Cans',
          type:"number"
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