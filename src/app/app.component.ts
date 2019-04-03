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


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              private translateService: TranslateService,
              public splashScreen: SplashScreen) {

    translateService.setDefaultLang('en');
    translateService.use('en');

    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pages = [
      { title: 'DASH BOARD',            component: DealerDashBoardPage },
      { title: 'ORDERS',                component: DealerOrdersHomePage },
      { title: 'PRE - ORDERS',          component: DealerPreOrdersPage },
      { title: 'CUSTOMERS',             component: DealerCustomersPage },
      { title: 'PRODUCTS',              component: DealerProductsPage },
      { title: 'PAYMENTS',              component: DealerPaymentsHomePage },
      { title: 'SCHEDULE ORDERS',       component: DealerScheduleOrdersPage },
      { title: 'SUPPLIERS',             component: DealerSuppliersPage },
      { title: 'DISTRIBUTORS',          component: DealerDistributorsPage },
      { title: 'POINTS VIEW',           component: DealerPointsPage },
      { title: 'FEEDBACK',              component: FeedbackPage },
      { title: 'STOCK NOTIFICATIONS',   component: DealerStockNotificationsHomePage },
      { title: 'SALES REPORT',          component: DealerSalesReportHomePage },
      { title: 'CATEGORY',              component: DealerCategoryHomePage },
      { title: 'MARKET PLACE',          component: DealerMarketPlacePage },
      { title: 'TRACK SUPPLIER',        component: DealerTrackSupplierPage },
      { title: 'PROMO CODES',           component: DealerPromoCodesPage },
      { title: 'PROFILE',               component: DealerProfilePage },
      { title: 'ABOUT US',              component: AboutUsPage },
      { title: 'LOGOUT',                component: LogoutPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
