import {Component} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";

// import {SuperTabs} from "ionic2-super-tabs";


@IonicPage()
@Component({
  selector: 'page-dealer-orders-home',
  templateUrl: 'dealer-orders-home.html',
})
export class DealerOrdersHomePage {

  pages = [
    {pageName: 'DealerOrdersOrderedPage', title: 'ORDERED', icon: 'cloud-download', id: 'orderedTab'},
    {pageName: 'DealerOrdersCompletedPage', title: 'COMPLETED', icon: 'cloud-upload', id: 'completedTab'}
  ];

  selectedTab = 0;

  // @ViewChild(SuperTabs) superTabs: SuperTabs;

  orders: string[] = [];
  baseImgUrl: string;
  extensionPng: string = '.png';
  uType: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private network: NetworkProvider,
              private  apiUrl: ApiProvider,
              private menuCtrl: MenuController,
              private alertUtils: UtilsProvider,
              private platform: Platform,
              private alertCtrl: AlertController) {
    this.uType = this.navParams.get('uType');

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  onTabSelect(ev: any) {
    this.selectedTab = ev.index;
    // this.superTabs.clearBadge(this.pages[ev.index].id);
    /*if (ev.index === 2) {
      /!*let alert = this.alertCtrl.create({
        title: 'Secret Page',
        message: 'Are you sure you want to access that page?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.superTabs.slideTo(this.selectedTab);
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.selectedTab = ev.index;
            }
          }
        ]
      });
      alert.present();*!/
    } else {
      this.selectedTab = ev.index;
      this.superTabs.clearBadge(this.pages[ev.index].id);
    }*/

  }

  ionViewDidLoad() {

    if (this.uType == UserType.DEALER || this.uType == UserType.CUSTOMER_CARE) {
      this.menuCtrl.enable(true, 'menu1');

      this.menuCtrl.enable(false, 'menu2');
      this.menuCtrl.enable(false, 'menu3');
      this.menuCtrl.enable(false, 'menu4');
      this.menuCtrl.enable(false, 'menu5');
    } else if (this.uType == UserType.Job_Assigner) {
      this.menuCtrl.enable(true, 'menu4');

      this.menuCtrl.enable(false, 'menu1');
      this.menuCtrl.enable(false, 'menu2');
      this.menuCtrl.enable(false, 'menu3');
      this.menuCtrl.enable(false, 'menu5');
    } else if (this.uType == UserType.Billing_Administrator) {
      this.menuCtrl.enable(true, 'menu5');

      this.menuCtrl.enable(false, 'menu1');
      this.menuCtrl.enable(false, 'menu2');
      this.menuCtrl.enable(false, 'menu3');
      this.menuCtrl.enable(false, 'menu4');
    }

    /* this.baseImgUrl = this.apiUrl.imageDownload()+'product_';

     let url = this.apiUrl.orderByStatus();

     let input = {
       "order": {
         "userid": UtilsProvider.USER_ID,
         "usertype": UtilsProvider.USER_TYPE,
         "status": 'all',
         "pagesize": '10',
         "last_orderid": '0',
         "framework": FRAMEWORK,
         "apptype": APP_TYPE
       }
     };

     let data = JSON.stringify(input);

     //this.utils.showLoading();
     this.network.postReq(url,data).then(res=>{
       //this.utils.hideLoading();
       this.utils.showLog("POST (SUCCESS)=> ORDERS: ALL : "+JSON.stringify(res));
       this.orders = res.data;
     },error=>{
       this.utils.showLog("POST (ERROR)=> ORDERS: ALL : "+error);
       //this.utils.hideLoading();
     })*/

  }

}
