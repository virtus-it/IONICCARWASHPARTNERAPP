import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {APP_TYPE, APP_USER_TYPE, FRAMEWORK, MOBILE_TYPE, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";
import {SuperTabs} from "ionic2-super-tabs";


@IonicPage()
@Component({
  selector: 'page-dealer-orders-home',
  templateUrl: 'dealer-orders-home.html',
})
export class DealerOrdersHomePage {

  pages = [
    {pageName: 'DealerOrdersOrderedPage',   title: 'ORDERED',   icon: 'cloud-download', id: 'orderedTab'},
    {pageName: 'DealerOrdersForwardPage',   title: 'FORWARD',   icon: 'cloud-upload',   id: 'forwardTab'},
    {pageName: 'DealerOrdersMiscPage',      title: 'MISC',      icon: 'cloud',          id: 'miscTab'},
  ];

  selectedTab = 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;

  orders: string[] = [];
  baseImgUrl: string;
  extensionPng: string = '.png';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private network: NetworkProvider,
              private  apiUrl: ApiProvider,
              private menuCtrl: MenuController,
              private alertCtrl: AlertController) {


  }

  onTabSelect(ev: any) {
    this.selectedTab = ev.index;
    this.superTabs.clearBadge(this.pages[ev.index].id);
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

     this.menuCtrl.enable(true);

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
