import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams, Platform} from 'ionic-angular';
import {KEY_USER_INFO, UserType, UtilsProvider} from "../../providers/utils/utils";
import {NetworkProvider} from "../../providers/network/network";
import {ApiProvider} from "../../providers/api/api";
// import {SuperTabs} from "ionic2-super-tabs";
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-supplier-orders-home',
  templateUrl: 'supplier-orders-home.html',
})
export class SupplierOrdersHomePage {

  pages = [
    {pageName: 'SupplierOrdersPendingPage',   title: 'PENDING',   icon: 'cloud-download',   id: 'pendingTab'},
    {pageName: 'SupplierOrdersCompletedPage', title: 'COMPLETED', icon: 'cloud-upload',     id: 'completedTab'}
  ];

  selectedTab = 0;

  // @ViewChild(SuperTabs) superTabs: SuperTabs;

  orders: string[] = [];
  baseImgUrl: string;
  extensionPng: string = '.png';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private utils: UtilsProvider,
              private network: NetworkProvider,
              private  apiUrl: ApiProvider,
              private menuCtrl: MenuController,
              private geolocation: Geolocation,
              private platform: Platform,
              private alertUtils: UtilsProvider,
              private alertCtrl: AlertController) {

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
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(false,'menu1');
    this.menuCtrl.enable(true,'menu2');
    this.menuCtrl.enable(false,'menu3');
    this.menuCtrl.enable(false,'menu4');
    this.menuCtrl.enable(false,'menu5');

    try {
      let watch = this.geolocation.watchPosition({ maximumAge: 0, timeout: 10000, enableHighAccuracy: true });
      watch.subscribe((data) => {
        try {
          if (data && data.coords && data.coords.latitude && data.coords.longitude) {
            this.alertUtils.location.latitude = (data.coords.latitude).toString();
            this.alertUtils.location.longitude = (data.coords.longitude).toString();
          }
        } catch (e) {
          this.alertUtils.showLog(e);
        }
      });

    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

}
