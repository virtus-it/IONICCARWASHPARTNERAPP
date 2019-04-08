import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {DealerDashBoardPage} from "../pages/dealer-dash-board/dealer-dash-board";
import {DealerOrdersHomePage} from "../pages/dealer-orders-home/dealer-orders-home";
import {DealerPreOrdersPage} from "../pages/dealer-pre-orders/dealer-pre-orders";
import {DealerCustomersPage} from "../pages/dealer-customers/dealer-customers";
import {DealerProductsPage} from "../pages/dealer-products/dealer-products";
import {DealerPaymentsHomePage} from "../pages/dealer-payments-home/dealer-payments-home";
import {DealerScheduleOrdersPage} from "../pages/dealer-schedule-orders/dealer-schedule-orders";
import {DealerSuppliersPage} from "../pages/dealer-suppliers/dealer-suppliers";
import {DealerDistributorsPage} from "../pages/dealer-distributors/dealer-distributors";
import {DealerPointsPage} from "../pages/dealer-points/dealer-points";
import {FeedbackPage} from "../pages/feedback/feedback";
import {DealerStockNotificationsHomePage} from "../pages/dealer-stock-notifications-home/dealer-stock-notifications-home";
import {DealerSalesReportHomePage} from "../pages/dealer-sales-report-home/dealer-sales-report-home";
import {DealerCategoryHomePage} from "../pages/dealer-category-home/dealer-category-home";
import {DealerMarketPlacePage} from "../pages/dealer-market-place/dealer-market-place";
import {DealerTrackSupplierPage} from "../pages/dealer-track-supplier/dealer-track-supplier";
import {DealerPromoCodesPage} from "../pages/dealer-promo-codes/dealer-promo-codes";
import {DealerProfilePage} from "../pages/dealer-profile/dealer-profile";
import {AboutUsPage} from "../pages/about-us/about-us";
import {LogoutPage} from "../pages/logout/logout";
import {WelcomePage} from "../pages/welcome/welcome";
import {TranslateService} from "@ngx-translate/core";
import {UserType} from "../providers/utils/utils";
import {LoginPage} from "../pages/login/login";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  static userType:string = 'supplier';

  pages:          Array<{title: string, component: any, icon: string}>;
  pagesDealer:    Array<{title: string, component: any, icon: string}>;
  pagesSupplier:  Array<{title: string, component: any, icon: string}>;

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  constructor(public platform: Platform,
              public statusBar: StatusBar,
              private translateService: TranslateService,
              public splashScreen: SplashScreen) {

        translateService.setDefaultLang('en');
        translateService.use('en');

    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      //{ title: 'DASH BOARD',            component: DealerDashBoardPage,                 icon:"md-home" },
      { title: 'ORDERS',                component: DealerOrdersHomePage,                icon:"md-home" },
      //{ title: 'PRE - ORDERS',          component: DealerPreOrdersPage,                 icon:"md-home" },
      { title: 'CUSTOMERS',             component: DealerCustomersPage,                 icon:"md-home" },
      { title: 'SERVICES',              component: DealerProductsPage,                  icon:"md-home" },
      //{ title: 'PAYMENTS',              component: DealerPaymentsHomePage,              icon:"md-home" },
      //{ title: 'SCHEDULE ORDERS',       component: DealerScheduleOrdersPage,            icon:"md-home" },
      { title: 'SERVICE ENGINEERS',     component: DealerSuppliersPage,                 icon:"md-home" },
      { title: 'VENDORS',               component: DealerDistributorsPage,              icon:"md-home" },
      //{ title: 'POINTS VIEW',           component: DealerPointsPage,                    icon:"md-home" },
      { title: 'FEEDBACK',              component: FeedbackPage,                        icon:"md-home" },
      //{ title: 'STOCK NOTIFICATIONS',   component: DealerStockNotificationsHomePage,    icon:"md-home" },
      //{ title: 'SALES REPORT',          component: DealerSalesReportHomePage,           icon:"md-home" },
      //{ title: 'CATEGORY',              component: DealerCategoryHomePage,              icon:"md-home" },
      //{ title: 'MARKET PLACE',          component: DealerMarketPlacePage,               icon:"md-home" },
      //{ title: 'TRACK SUPPLIER',        component: DealerTrackSupplierPage,             icon:"md-home" },
      //{ title: 'PROMO CODES',           component: DealerPromoCodesPage,                icon:"md-home" },
      { title: 'PROFILE',               component: DealerProfilePage,                   icon:"md-home" },
      { title: 'ABOUT US',              component: AboutUsPage,                         icon:"md-home" },
      { title: 'LOGOUT',                component: LogoutPage,                          icon:"md-home" }
    ];

    /*this.pagesSupplier = [
      { title: 'ORDERS',                component: DealerOrdersHomePage },
      { title: 'PROFILE',               component: DealerProfilePage },
      { title: 'ABOUT US',              component: AboutUsPage },
      { title: 'LOGOUT',                component: LogoutPage }
    ];*/

    //this.pages = this.pagesDealer;
      //MyApp.updateList(UserType.SUPPLIER);

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  updateList(s){
    if(s == UserType.DEALER)
      this.pages = this.pagesDealer;
    else if(s == UserType.SUPPLIER)
      this.pages = this.pagesSupplier;
  }
}
