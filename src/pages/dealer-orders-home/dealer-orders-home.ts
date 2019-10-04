import {Component} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from "@ngx-translate/core";
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
              private alertCtrl: AlertController,
              private translateService: TranslateService) {
    this.uType = this.navParams.get('uType');

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

  ionViewWillEnter(){
    this.alertUtils.showLog('ionViewWillEnter - home');

    if(UtilsProvider.ORDER_STUAS_UPDATED){
      UtilsProvider.ORDER_STUAS_UPDATED = false;
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

    this.alertUtils.showLog('ionViewDidLoad - home');

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
  }

}
