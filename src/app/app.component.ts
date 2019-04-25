import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
// import {DealerCategoryHomePage} from "../pages/dealer-category-home/dealer-category-home";
// import {DealerDashBoardPage} from "../pages/dealer-dash-board/dealer-dash-board";
// import {DealerOrdersHomePage} from "../pages/dealer-orders-home/dealer-orders-home";
// import {DealerCustomersPage} from "../pages/dealer-customers/dealer-customers";
// import {DealerProductsPage} from "../pages/dealer-products/dealer-products";
// import {DealerSuppliersPage} from "../pages/dealer-suppliers/dealer-suppliers";
// import {DealerDistributorsPage} from "../pages/dealer-distributors/dealer-distributors";
// import {FeedbackPage} from "../pages/feedback/feedback";
// import {DealerProfilePage} from "../pages/dealer-profile/dealer-profile";
// import {AboutUsPage} from "../pages/about-us/about-us";
// import {LogoutPage} from "../pages/logout/logout";
import {TranslateService} from "@ngx-translate/core";
import {UtilsProvider} from "../providers/utils/utils";
// import {LoginPage} from "../pages/login/login";
// import {SupplierOrdersHomePage} from "../pages/supplier-orders-home/supplier-orders-home";
import {Push, PushObject, PushOptions} from "@ionic-native/push";
// import {DealerUsersCustomercarePage} from "../pages/dealer-users-customercare/dealer-users-customercare";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  static userType: string = 'supplier';
  @ViewChild(Nav) nav: Nav;
  rootPage: any = 'LoginPage';
  showProgress: boolean = true;
  pagesDealer: Array<{ title: string, component: any, icon: string }>;
  pagesSupplier: Array<{ title: string, component: any, icon: string }>;
  pagesVendor: Array<{ title: string, component: any, icon: string }>;
  private isNotification: boolean = false;

  constructor(public platform: Platform,
              public push: Push,
              public statusBar: StatusBar,
              public alertUtils: UtilsProvider,
              private translateService: TranslateService,
              public splashScreen: SplashScreen) {

    translateService.setDefaultLang('en');
    translateService.use('en');

    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pagesDealer = [
      {title: 'DASH BOARD', component: 'DealerDashBoardPage',   icon: "assets/imgs/img_dashboard.png"},
      {title: 'JOBS',       component: 'DealerOrdersHomePage',  icon: "assets/imgs/img_job.png"},
      {title: 'CUSTOMERS',  component: 'DealerCustomersPage',   icon: "assets/imgs/img_user.png"},
      {title: 'SERVICES',   component: 'DealerProductsPage',    icon: "assets/imgs/img_repairing_service.png"},
      //{ title: 'PAYMENTS',              component: DealerPaymentsHomePage,              icon:"md-home" },
      //{ title: 'SCHEDULE ORDERS',       component: DealerScheduleOrdersPage,            icon:"md-home" },
      {title: 'SERVICE ENGINEERS', component: 'DealerSuppliersPage', icon: "assets/imgs/img_engineer.png"},
      {title: 'VENDORS', component: 'DealerDistributorsPage', icon: "assets/imgs/img_vendor.png"},
      {title: 'CUSTOMER CARE', component: 'DealerUsersCustomercarePage', icon: "assets/imgs/img_customer_care.png"},
      {title: 'FEEDBACK', component: 'FeedbackPage', icon: "assets/imgs/img_rating.png"},
      //{ title: 'STOCK NOTIFICATIONS',   component: DealerStockNotificationsHomePage,    icon:"md-home" },
      //{ title: 'SALES REPORT',          component: DealerSalesReportHomePage,           icon:"md-home" },
      {title: 'CATEGORY', component: 'DealerCategoryHomePage', icon: "assets/imgs/img_categories.png"},
      //{ title: 'MARKET PLACE',   l̥l̥       component: DealerMarketPlacePage,               icon:"md-home" },
      //{ title: 'TRACK SUPPLIER',        component: DealerTrackSupplierPage,             icon:"md-home" },
      //{ title: 'PROMO CODES',           component: DealerPromoCodesPage,                icon:"md-home" },
      {title: 'PROFILE', component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US', component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT', component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
    ];

    this.pagesSupplier = [
      {title: 'ORDERS', component: 'SupplierOrdersHomePage', icon: "md-home"},
      {title: 'VENDOR', component: 'DealerDistributorsPage', icon: "md-home"},
      {title: 'PROFILE', component: 'DealerProfilePage', icon: "md-home"},
      {title: 'ABOUT US', component: 'AboutUsPage', icon: "md-home"},
      {title: 'LOGOUT', component: 'LogoutPage', icon: "md-home"}
    ];

    this.pagesVendor = [
      {title: 'SERVICE ENGINEERS', component: 'DealerSuppliersPage', icon: "md-home"},
      {title: 'PROFILE', component: 'DealerProfilePage', icon: "md-home"},
      {title: 'ABOUT US', component: 'AboutUsPage', icon: "md-home"},
      {title: 'LOGOUT', component: 'LogoutPage', icon: "md-home"}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  initPushNotification() {
    this.alertUtils.showLog("initPushNotification");
    try {
      if (!this.platform.is('cordova')) {
        this.showProgress = false;
        this.rootPage = 'LoginPage';
        this.alertUtils.showLog('Push notifications not initialized. Cordova is not available - Run in physical device');
        return;
      }
      const options: PushOptions = {
        android: {
          senderID: '530358294125',
          sound: true,
          forceShow: true
        },
        ios: {
          alert: 'true',
          badge: false,
          sound: 'true'
        },
        windows: {},
        browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
      };
      const pushObject: PushObject = this.push.init(options);

      pushObject.on('registration').subscribe((data: any) => {
        this.alertUtils.showLog('device token -> ' + data.registrationId);
        UtilsProvider.setGCM(data.registrationId);
        this.alertUtils.saveGcmId(data.registrationId);
      });
      pushObject.on('notification').subscribe((notification: any) => {
          this.alertUtils.showLog('Received a notification');
          this.isNotification = true;
          //this.alertUtils.updateStaticValue();
          /*this.alertUtils.getLoginState().then(value => {
            if (value) {
              this.showProgress = false;
              this.splashScreen.hide();
              this.alertUtils.showLog(this.isNotification);
              let data = JSON.stringify(notification);
              this.alertUtils.showLog(data);
              if (notification.additionalData.foreground) {

              } else {
                this.alertUtils.showLog('Push notification clicked');
                //if user NOT using app and push notification comes
                if (notification.additionalData.status == "createmessage") {
                  if (notification.additionalData.obj.message.order.orderid) {
                    this.nav.push('OrderDetails', {
                      callfrom: "pushnotification",
                      orderid: notification.additionalData.obj.message.order.orderid
                    }).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  /!*} else {
                    this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  }*!/
                } /!*else if (notification.additionalData.status == "ordered") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "delivered") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "doorlock") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "rejected") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "not_reachable") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "cannot_deliver") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "confirm") {
                  this.nav.push('MyPaymentPage', {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "orderupdated") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "assigned") {
                  this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.status == "notification") {
                  this.nav.push(NotificationPage, {
                    callfrom: "pushnotification",
                    data: notification
                  }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else {
                  if (notification.additionalData.redirectpage == "AboutPage") {
                    this.nav.push(AboutPage, {callfrom: "pushnotification"}).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  } else if (notification.additionalData.redirectpage == "HomePage") {
                    this.nav.push(HomePage, {callfrom: "pushnotification"}).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  } else if (notification.additionalData.redirectpage == "ContactPage") {
                    this.nav.push(ContactPage, {callfrom: "pushnotification"}).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  } else if (notification.additionalData.redirectpage == "OrderDetails") {
                    this.nav.push('OrderDetails', {
                      callfrom: "pushnotification",
                      orderid: notification.additionalData.obj.message.order.orderid
                    }).then(res => {
                      this.updateNotificationStatus(notification);
                    });
                  } else {
                    this.showProgress = false;
                    this.rootPage = LoginPage;
                  }*!/
                }
              }
            } else {
              this.splashScreen.hide();
              this.showProgress = false;
              this.rootPage = Login;
            }
          }).catch(reason => {
            this.splashScreen.hide();
            this.showProgress = false;
            this.rootPage = Login;
          });*/
        }, error2 => {
          this.splashScreen.hide();
          this.showProgress = false;
          this.rootPage = 'LoginPage';
        }
      );
      pushObject.on('error').subscribe(error => this.alertUtils.showLog('Error with Push plugin' + error));

      this.alertUtils.showLog('before setTimeout');
      setTimeout(() => {
        this.alertUtils.showLog('END');
        this.alertUtils.showLog(this.isNotification);
        if (!this.isNotification) {
          this.splashScreen.hide();
          this.showProgress = false;
          this.rootPage = 'LoginPage';
        }
      }, 1000);
    } catch (e) {
      this.showProgress = false;
      this.rootPage = 'LoginPage';
      this.alertUtils.showLog("CATCH BLOCK");
      this.alertUtils.showLog(JSON.stringify(e));
    }
  }

  updateNotificationStatus(notification) {
    /*try {
      let input = {
        "User": {
          "transtype": "updatenotificationstatus",
          "apptype": APP_TYPE,
          "user_type": APP_USER_TYPE
        }
      };
      if (Utils.APP_USER_ID) {
        input["customerid"] = Utils.APP_USER_ID;
        input["createdby"] = Utils.APP_USER_ID;
      }
      if (Utils.APP_USER_DEALERID) {
        input["dealerid"] = Utils.APP_USER_DEALERID;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.title) {
        input["notificationtag"] = notification.additionalData.obj.title;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.type) {
        input["notificationtype"] = notification.additionalData.obj.type;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.notifyuniqueid) {
        input["notifyuniqueid"] = notification.additionalData.obj.notifyuniqueid;
      }
      if (this.alertUtils.getDeviceUUID()) {
        input["useruniqueid"] = this.alertUtils.getDeviceUUID();
      }
      let data = JSON.stringify(input);
      this.alertUtils.showLog(data);
      this.apiService.postReq(GetService.notificationResponse(), data).then(response => {
        if (response)
          this.alertUtils.showLog(response);
      }, err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }*/

  }
}
