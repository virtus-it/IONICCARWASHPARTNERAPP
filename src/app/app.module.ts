import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import {WelcomePage} from "../pages/welcome/welcome";
import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
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


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {RegisterPage} from "../pages/register/register";
import { ApiProvider } from '../providers/api/api';
import { UtilsProvider } from '../providers/utils/utils';
import { NetworkProvider } from '../providers/network/network';
import {HttpModule} from "@angular/http";
import {SuperTabsModule} from "ionic2-super-tabs";
import {DealerProductsStockHistoryPage} from "../pages/dealer-products-stock-history/dealer-products-stock-history";
import {DealerPreOrdersCartPage} from "../pages/dealer-pre-orders-cart/dealer-pre-orders-cart";



@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    LoginPage,
    RegisterPage,
    HomePage,
    ListPage,
    DealerDashBoardPage,
    DealerOrdersHomePage,
    DealerPreOrdersPage,
    DealerCustomersPage,
    DealerProductsPage,
    DealerPaymentsHomePage,
    DealerScheduleOrdersPage,
    DealerSuppliersPage,
    DealerDistributorsPage,
    DealerPointsPage,
    FeedbackPage,
    DealerStockNotificationsHomePage,
    DealerSalesReportHomePage,
    DealerCategoryHomePage,
    DealerMarketPlacePage,
    DealerTrackSupplierPage,
    DealerPromoCodesPage,
    DealerProfilePage,
    DealerProductsStockHistoryPage,
    AboutUsPage,
    LogoutPage,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    LoginPage,
    RegisterPage,
    HomePage,
    ListPage,
    DealerDashBoardPage,
    DealerOrdersHomePage,
    DealerPreOrdersPage,
    DealerCustomersPage,
    DealerProductsPage,
    DealerPaymentsHomePage,
    DealerScheduleOrdersPage,
    DealerSuppliersPage,
    DealerDistributorsPage,
    DealerPointsPage,
    FeedbackPage,
    DealerStockNotificationsHomePage,
    DealerSalesReportHomePage,
    DealerCategoryHomePage,
    DealerMarketPlacePage,
    DealerTrackSupplierPage,
    DealerPromoCodesPage,
    DealerProfilePage,
    DealerProductsStockHistoryPage,
    AboutUsPage,
    LogoutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    UtilsProvider,
    NetworkProvider
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}