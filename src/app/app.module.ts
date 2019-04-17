import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {MyApp} from './app.component';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {ApiProvider} from '../providers/api/api';
import {UtilsProvider} from '../providers/utils/utils';
import {NetworkProvider} from '../providers/network/network';
import {HttpModule} from "@angular/http";
import {SuperTabsModule} from "ionic2-super-tabs";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

import {Geolocation} from '@ionic-native/geolocation';

import {Camera} from '@ionic-native/camera';
import {SocketIoConfig, SocketIoModule} from 'ng-socket-io';
import {UniqueDeviceID} from "@ionic-native/unique-device-id";
import {Push} from "@ionic-native/push";

// import {WelcomePage} from "../pages/welcome/welcome";
// import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {ListPage} from "../pages/list/list";
import {NativeStorage} from "@ionic-native/native-storage";
// import {DealerDashBoardPage} from "../pages/dealer-dash-board/dealer-dash-board";
// import {DealerOrdersHomePage} from "../pages/dealer-orders-home/dealer-orders-home";
//
// import {DealerCustomersPage} from "../pages/dealer-customers/dealer-customers";
// import {DealerProductsPage} from "../pages/dealer-products/dealer-products";
// import {DealerPaymentsHomePage} from "../pages/dealer-payments-home/dealer-payments-home";
// import {DealerScheduleOrdersPage} from "../pages/dealer-schedule-orders/dealer-schedule-orders";
// import {DealerSuppliersPage} from "../pages/dealer-suppliers/dealer-suppliers";
// import {DealerDistributorsPage} from "../pages/dealer-distributors/dealer-distributors";
// import {DealerPointsPage} from "../pages/dealer-points/dealer-points";
// import {FeedbackPage} from "../pages/feedback/feedback";
// import {DealerStockNotificationsHomePage} from "../pages/dealer-stock-notifications-home/dealer-stock-notifications-home";
// import {DealerSalesReportHomePage} from "../pages/dealer-sales-report-home/dealer-sales-report-home";
// import {DealerCategoryHomePage} from "../pages/dealer-category-home/dealer-category-home";
// import {DealerMarketPlacePage} from "../pages/dealer-market-place/dealer-market-place";
// import {DealerTrackSupplierPage} from "../pages/dealer-track-supplier/dealer-track-supplier";
// import {DealerPromoCodesPage} from "../pages/dealer-promo-codes/dealer-promo-codes";
// import {DealerProfilePage} from "../pages/dealer-profile/dealer-profile";
// import {LogoutPage} from "../pages/logout/logout";
// import {RegisterPage} from "../pages/register/register";
// import {DealerOrderDetailsPageModule} from "../pages/dealer-order-details/dealer-order-details.module";
// import {SupplierOrdersHomePage} from "../pages/supplier-orders-home/supplier-orders-home";
// import {DealerUsersCustomercarePage} from "../pages/dealer-users-customercare/dealer-users-customercare";
const config: SocketIoConfig = {url: ApiProvider.SOCKET_DEMO_URL, options: {}};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    // WelcomePage,
    // RegisterPage,
    HomePage,
    ListPage,
    // DealerDashBoardPage,
    // DealerOrdersHomePage,
    // DealerCustomersPage,
    // DealerProductsPage,
    // DealerPaymentsHomePage,
    // DealerScheduleOrdersPage,
    // DealerSuppliersPage,
    // DealerDistributorsPage,
    // DealerPointsPage,
    // FeedbackPage,
    // DealerStockNotificationsHomePage,
    // DealerSalesReportHomePage,
    // DealerCategoryHomePage,
    // DealerMarketPlacePage,
    // DealerTrackSupplierPage,
    // DealerPromoCodesPage,
    // DealerProfilePage,
    // DealerUsersCustomercarePage,
    // SupplierOrdersHomePage,
    // LogoutPage,
    // LoginPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    // DealerOrderDetailsPageModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    SocketIoModule.forRoot(config),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // WelcomePage,
    // RegisterPage,
    HomePage,
    ListPage,
    // DealerDashBoardPage,
    // DealerOrdersHomePage,
    // DealerCustomersPage,
    // DealerProductsPage,
    // DealerPaymentsHomePage,
    // DealerScheduleOrdersPage,
    // DealerSuppliersPage,
    // DealerDistributorsPage,
    // DealerPointsPage,
    // FeedbackPage,
    // DealerStockNotificationsHomePage,
    // DealerSalesReportHomePage,
    // DealerCategoryHomePage,
    // DealerMarketPlacePage,
    // DealerTrackSupplierPage,
    // DealerPromoCodesPage,
    // DealerProfilePage,
    // SupplierOrdersHomePage,
    // DealerUsersCustomercarePage,
    // LogoutPage,
    // LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    NativeStorage,
    Camera,
    Push,
    UtilsProvider,
    NetworkProvider,
    Geolocation
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
