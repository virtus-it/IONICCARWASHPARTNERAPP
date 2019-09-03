import {Component, ViewChild} from '@angular/core';
import {AlertController, Nav, NavController, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";
import {UtilsProvider} from "../providers/utils/utils";
import {Push, PushObject, PushOptions} from "@ionic-native/push";



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
  pagesJobAssigner: Array<{ title: string, component: any, icon: string }>;
  pagesBilling: Array<{ title: string, component: any, icon: string }>;
  private isNotification: boolean = false;

  constructor(public platform: Platform,
              public push: Push,
              public statusBar: StatusBar,
              private alertCtrl: AlertController,
              //public navCtrl: NavController,
              public alertUtils: UtilsProvider,
              private translateService: TranslateService,
              public splashScreen: SplashScreen) {

    translateService.setDefaultLang('en');
    translateService.use('en');

    this.initializeApp();

    // used for an example of ngFor and navigation

    this.pagesDealer = [
      {title: 'DASH BOARD',     component: 'DealerDashBoardPage',   icon: "assets/imgs/img_dashboard.png"},
      {title: 'JOBS',           component: 'DealerOrdersHomePage',  icon: "assets/imgs/img_job.png"},
      {title: 'CUSTOMERS',      component: 'DealerCustomersPage',   icon: "assets/imgs/img_user.png"},
      //{title: 'SERVICES',       component: 'DealerProductsPage',    icon: "assets/imgs/img_repairing_service.png"},
      // {title: 'PACKAGE',        component: 'DealerPackagePage', icon: "assets/imgs/img_package.png"},
      {title: 'CATEGORY',       component: 'DealerCategoryHomePage', icon: "assets/imgs/img_categories.png"},
      {title: 'MODELS',        component: 'DealerCarModelsPage', icon: "assets/imgs/img_car.png"},
      {title: 'SERVICE AGENTS', component: 'DealerSuppliersPage', icon: "assets/imgs/img_engineer.png"},
      {title: 'VENDORS',        component: 'DealerDistributorsPage', icon: "assets/imgs/img_vendor.png"},
      {title: 'USERS',          component: 'DealerUsersCustomercarePage', icon: "assets/imgs/img_customer_care.png"},
      {title: 'PAYMENTS',       component: 'DealerPaymentsHomePage', icon: "assets/imgs/img_payments.png"},
      {title: 'SMS REPORTS',    component: 'SmsReportsPage', icon: "assets/imgs/img_rating.png"},
      {title: 'FEEDBACK',       component: 'FeedbackPage', icon: "assets/imgs/img_rating.png"},
      {title: 'SERVICE AREAS',  component: 'ServiceAreasPage', icon: "assets/imgs/img_rating.png"},
      {title: 'PROFILE',        component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US',       component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT',         component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
    ];

    this.pagesSupplier = [
      {title: 'JOBS',           component: 'SupplierOrdersHomePage',  icon: "assets/imgs/img_job.png"},
      {title: 'PAYMENTS',       component: 'DealerPaymentsHomePage', icon: "assets/imgs/img_payments.png"},
      {title: 'VENDORS',        component: 'DealerDistributorsPage', icon: "assets/imgs/img_vendor.png"},
      {title: 'PROFILE',        component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US',       component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT',         component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
    ];

    this.pagesVendor = [
      {title: 'SERVICE AGENTS', component: 'DealerSuppliersPage', icon: "assets/imgs/img_engineer.png"},
      {title: 'PROFILE',        component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US',       component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT',         component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
    ];

    this.pagesJobAssigner = [
      {title: 'DASH BOARD',     component: 'DealerDashBoardPage',   icon: "assets/imgs/img_dashboard.png"},
      {title: 'JOBS',           component: 'DealerOrdersHomePage',  icon: "assets/imgs/img_job.png"},
      {title: 'SERVICE AGENTS', component: 'DealerSuppliersPage', icon: "assets/imgs/img_engineer.png"},
      {title: 'PROFILE',        component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US',       component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT',         component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
    ];

    this.pagesBilling = [
      {title: 'DASH BOARD',     component: 'DealerDashBoardPage',   icon: "assets/imgs/img_dashboard.png"},
      {title: 'JOBS',           component: 'DealerOrdersHomePage',  icon: "assets/imgs/img_job.png"},
      {title: 'PAYMENTS',       component: 'DealerPaymentsHomePage', icon: "assets/imgs/img_payments.png"},
      {title: 'VENDORS',        component: 'DealerDistributorsPage', icon: "assets/imgs/img_vendor.png"},
      {title: 'SERVICE AGENTS', component: 'DealerSuppliersPage', icon: "assets/imgs/img_engineer.png"},
      {title: 'PROFILE',        component: 'DealerProfilePage', icon: "assets/imgs/img_user.png"},
      {title: 'ABOUT US',       component: 'AboutUsPage', icon: "assets/imgs/img_about.png"},
      {title: 'LOGOUT',         component: 'LogoutPage', icon: "assets/imgs/img_logout.png"}
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
          //sound: true,
          sound: this.setSound(),
          forceShow: true,
          vibrate: true
        },
        ios: {
          alert: 'true',
          badge: false,
          sound: 'true',
          //vibrate: true
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

  setSound() {
    //if (this.platform.is('android')) {
      return 'file://assets/sounds/ringtone.mp3'
    /*} else {
      return 'file://assets/sounds/bell.mp3'
    }*/
  }

  showPromptForLogout() {
    let prompt = this.alertCtrl.create({
      title: 'LOGOUT',
      message: 'Are you sure. You want to logout?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Sure',
          handler: data => {
            this.logout();
          }
        }
      ]
    });
    prompt.present();
  }

  logout(){
    UtilsProvider.setUSER_INFO('');
    this.alertUtils.initUser('');
    try {
      this.alertUtils.setUserInfo('').then((success) => {
        this.alertUtils.showLog('User Info Updated : '+success);
      }, error => {
        this.alertUtils.showLog('User Info Updated : '+error);
      });
    }catch (e) {
      this.alertUtils.showLog(e);
    }
    //this.navCtrl.setRoot('LoginPage')
  }
}
