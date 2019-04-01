import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {SuperTabs} from "ionic2-super-tabs";
import {UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";
import {DealerStockNotificationsAllPage} from "../dealer-stock-notifications-all/dealer-stock-notifications-all";
import {DealerStockNotificationsPendingPage} from "../dealer-stock-notifications-pending/dealer-stock-notifications-pending";
import {DealerStockNotificationsConfirmedPage} from "../dealer-stock-notifications-confirmed/dealer-stock-notifications-confirmed";


@IonicPage()
@Component({
  selector: 'page-dealer-stock-notifications-home',
  templateUrl: 'dealer-stock-notifications-home.html',
})
export class DealerStockNotificationsHomePage {

  pages = [
    {pageName: 'DealerStockNotificationsAllPage',       title: 'ALL',       icon: 'cloud-download', id: 'stockAll'},
    {pageName: 'DealerStockNotificationsPendingPage',   title: 'PENDING',   icon: 'cloud-upload',   id: 'stockPending'},
    {pageName: 'DealerStockNotificationsConfirmedPage', title: 'CONFIRMED', icon: 'cloud',          id: 'stockConfirmed'},
  ];

  selectedTab = 0;

  @ViewChild(SuperTabs) superTabs: SuperTabs;

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
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
  }

}
