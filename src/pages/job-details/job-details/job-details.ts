import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {
  AlertController,
  App,
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ViewController
} from 'ionic-angular';
import {
  APP_TYPE,
  APP_USER_TYPE, FRAMEWORK,
  KEY_USER_INFO,
  OrderTypes,
  RES_SUCCESS,
  UserType,
  UtilsProvider
} from "../../../providers/utils/utils";

import * as moment from 'moment';
import {ApiProvider} from "../../../providers/api/api";

import {DealerOrdersOrderedPage} from "../../dealer-orders-ordered/dealer-orders-ordered";
import {PhotoViewer} from "@ionic-native/photo-viewer";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {MapUtilsProvider} from "../../../providers/map-utils/map-utils";
import {TranslateService} from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-job-details',
  templateUrl: 'job-details.html',
})
export class JobDetailsPage {

  model: any;
  @ViewChild(Content) content: Content;

  item: any;
  rate: number = 0;
  preImg: string = '';
  postImg: string = '';
  showProgress = true;
  editorMsg: string = "";
  buttonTitle: any = "Assign";
  suppliersList = [];
  distributorsList: string[];
  productsList: string[];
  showBackButton: boolean = false;
  userEnum: typeof UserType = UserType;
  userType:any;
  private dealerID = "";
  private userID = "";
  private callFrom = "";
  private orderId = "";
  private categoryID = "";
  event:any;
  isSuperDealer:boolean = false;

  constructor(private modalCtrl: ModalController,
              private ref: ChangeDetectorRef,
              public appCtrl: App,
              private photoViewer: PhotoViewer,
              public navCtrl: NavController,
              public param: NavParams,
              public alertUtils: UtilsProvider,
              private platform: Platform,
              private mapUtils: MapUtilsProvider,
              private nativeGeocoder: NativeGeocoder,
              private viewCtrl: ViewController,
              public alertCtrl: AlertController,
              private apiService: ApiProvider,
              private translateService: TranslateService) {

    this.alertUtils.showLog('JobDetailsPage');

    this.alertUtils.initUser(this.alertUtils.getUserInfo());

    translateService.setDefaultLang('en');
    translateService.use('en');

    this.callFrom = this.param.get("callFrom");
    this.orderId = this.param.get("orderid");
    this.categoryID = this.param.get("categoryid");

    if (this.callFrom == 'ordered')
      this.showBackButton = true;
    else
      this.showBackButton = false;


    if (this.orderId) {
      this.preImg = this.apiService.getImg() + "pre_" + this.orderId + ".png";
      this.postImg = this.apiService.getImg() + "post_" + this.orderId + ".png";
    }

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


            this.userID = UtilsProvider.USER_ID;
            this.dealerID = UtilsProvider.USER_DEALER_ID;
            this.userType = UtilsProvider.USER_TYPE;
            this.isSuperDealer = UtilsProvider.ISSUPER_DEALER;

            //initial call
            if (this.orderId)
              this.fetchOrderDetails();
            else
              this.alertUtils.showLog('job id is not found');
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.userID = UtilsProvider.USER_ID;
            this.dealerID = UtilsProvider.USER_DEALER_ID;
            this.userType = UtilsProvider.USER_TYPE;
            this.isSuperDealer = UtilsProvider.ISSUPER_DEALER;

            //initial call
            if (this.orderId)
              this.fetchOrderDetails();
            else
              this.alertUtils.showLog('job id is not found');
          }
        });
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }

  doRefresh(refresher) {
    this.event = refresher;
    this.fetchOrderDetails();

    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  changeImage(type) {
    if (type == 1) {
      this.preImg = "http://executive-carwash.com/wp-content/uploads/2012/10/detail-icon.png";
    } else
      this.postImg = "http://executive-carwash.com/wp-content/uploads/2012/10/detail-icon.png";
  }

  getImage(type) {
    try {
      if (type == 1)
        this.photoViewer.show(this.preImg, 'BEFORE');
      else
        this.photoViewer.show(this.postImg, 'AFTER');

    } catch (error) {
      this.alertUtils.showLog(error);
    }

  }

  getDate(date) {
    let myDate;
    if (date) {
      date = date.replace('T', '');
      myDate = moment(date, 'YYYY-MM-DD hh:mm:ss').toDate()
      return moment(myDate).format("DD-MM-YY hh:mm");
    }
  }

  assignForward(event) {
    this.getSuppliers();
  }

  validate(s) {
    if (s) {
      if (s == null || s == 'null')
        return '';
      else
        return s;
    } else
      return '';
  }

  updatePaymentType(s){
    if(this.validate(s)){
      if(s == 'cash' || s == 'cod')
        return 'cod'
      else
        return 'card';
    }
  }

  sendMessage(item) {
    // this.showPrompt(item)
    if (this.alertUtils.validateText(this.editorMsg, "Message", 1, 250)) {
      this.createMessage(item, this.editorMsg)
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  /*Api calls*/
  fetchOrderDetails() {
    try {
      let url = this.apiService.getOrderDetails() + this.orderId + "/" + this.userID;

      this.apiService.getReq(url).then(res => {
        this.showProgress = false;

        if(this.event)
          this.event.complete();


        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showLog(res.data[0]);
          this.item = res.data[0];

          this.rate = this.item.customerreview;
          if(!this.rate)
            this.rate = 0;

          if (this.item.status == OrderTypes.DELIVERED) {
            this.item["billamt_updated"] = res.data[0].bill_amount;
          } else
            this.item["billamt_updated"] = res.data[0].orderamt;

          if (this.item.status == "assigned") {
            this.buttonTitle = 'Re - Assign';
          } else
            this.buttonTitle = 'Assign';


          if (this.item.status == "assigned" || this.item.status == "delivered") {
            if (this.item.supplierdetails) {
              this.item["showassignstatus"] = true;
              if (this.item.supplierdetails.lastname) {
                this.item["suppliername"] = this.item.supplierdetails.firstname + " " + this.item.supplierdetails.lastname;
              } else
                this.item["suppliername"] = this.item.supplierdetails.firstname;
            } else {
              this.item["showassignstatus"] = false;
            }
            if (this.item.status == "delivered")
              this.item["showdeliveredstatus"] = true
          }
          if (this.item.status == "onhold") {
            this.item["orderstatus"] = "Onhold";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "We have put your job on-hold as our Service Agent can't deliver, sorry for the inconvenience caused";
          } else if (this.item.status == "Cancelled" || this.item.status == "cancelled") {
            this.item["orderstatus"] = "Cancelled";
            this.item["statusColor"] = "danger";
            this.item["trackingmessage"] = "Not delivered: Cancelled";
            this.item["assigncolor"] = "danger";
            this.item["completedcolor"] = "danger";
          } else if (this.item.status == "rejected" || this.item.status == "Rejected") {
            this.item["orderstatus"] = "Rejected";
            this.item["statusColor"] = "danger";
            this.item["trackingmessage"] = "Not delivered: Rejected";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "danger";
          } else if (this.item.status == "assigned") {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Assigned to supplier";
            this.item["trackingmessage"] = "Assigned";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "";
          } else if (this.item.status == "accept" || this.item.status == 'Accept' || this.item.status == 'Accepted') {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Accepted by Service Agent";
            this.item["trackingmessage"] = "Accepted";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "";
          } else if (this.item.status == "delivered" || this.item.status == "Delivered") {
            this.item["orderstatus"] = "Delivered";
            this.item["statusColor"] = "success";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "success";
          } else if (this.item.status == OrderTypes.JOB_COMPLETED) {
            this.item["orderstatus"] = "Delivered";
            this.item["statusUpdated"] = "Payment Pending";
          }  else if (this.item.status == OrderTypes.ARRIVED) {
            this.item["orderstatus"] = "Arrived";
            this.item["statusUpdated"] = "Service Agent at Customer loc";
          } else if (this.item.status == "doorlock" || this.item.status == "Door Locked") {
            this.item["orderstatus"] = "Door Locked";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "Not delivered: Door - Locked";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "cannot_deliver" || this.item.status == "Cant Deliver") {
            this.item["orderstatus"] = "Cant Deliver";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "We have put your Job on-hold as our supplier can't deliver, sorry for the inconvenience caused";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "Not Reachable" || this.item.status == "not_reachable") {
            this.item["orderstatus"] = "Not Reachable";
            this.item["statusColor"] = "warning";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
            this.item["trackingmessage"] = "Your Job is unable to deliver due to your un-availablity";
          } else if (this.item.status == "pending") {
            this.item["orderstatus"] = "Pending";
            this.item["statusColor"] = "primary";
            this.item["trackingmessage"] = "Delivered";
          } else if (this.item.status == "ordered" || this.item.status == "backtodealer" || this.item.status.toLowerCase() == "accept") {
            this.item["orderstatus"] = "Order Placed";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "Delivered";
          } else {
            this.item["orderstatus"] = this.item.status;
          }

          if (this.item.status == OrderTypes.ORDERED ||
            this.item.status == OrderTypes.ASSIGNED ||
            this.item.status == OrderTypes.ACCEPT ||
            this.item.status == OrderTypes.ORDER_STARTED ||
            this.item.status == OrderTypes.BACKTODEALER ||
            this.item.status == OrderTypes.NOT_BROADCASTED) {

            this.item["orderstatus"] = "ASSIGN";

            if (this.item.status == OrderTypes.ORDERED ||
              this.item.status == OrderTypes.BACKTODEALER ||
              this.item.status == OrderTypes.NOT_BROADCASTED)
              this.item["statusUpdated"] = "Order Created";
            else if (this.item.status == OrderTypes.ASSIGNED)
              this.item["statusUpdated"] = "Assigned to Service Agent";
            else if (this.item.status == OrderTypes.ACCEPT)
              this.item["statusUpdated"] = "Order Accepted";
            else if (this.item.status == OrderTypes.ORDER_STARTED)
              this.item["statusUpdated"] = "Order Started";
            else if (this.item.status == OrderTypes.JOB_STARTED)
              this.item["statusUpdated"] = "Job Started";
          } else if (this.item.status == OrderTypes.DELIVERED) {
            this.item["orderstatus"] = "Job Completed";
            this.item["statusUpdated"] = "Job Completed";
          } else if (this.item.status == OrderTypes.CANNOT_DELIVER) {
            this.item["orderstatus"] = "CANT DELIVER";
          } else if (this.item.status == OrderTypes.DOORLOCK) {
            this.item["orderstatus"] = "DOORLOCK";
          } else if (this.item.status == OrderTypes.NOT_REACHABLE) {
            this.item["orderstatus"] = "NOT REACHABLE";
          } else if (this.item.status == OrderTypes.CANCELLED) {
            this.item["orderstatus"] = "CANCELLED";
            this.item["statusUpdated"] = "Order Cancelled";
          } else if (this.item.status == OrderTypes.ONHOLD) {
            this.item["orderstatus"] = "ON HOLD";
            this.item["statusUpdated"] = "Job is On Hold";
          }

          //updating bill amount
          if (this.item.status == OrderTypes.DELIVERED) {
            this.item["billamt_updated"] = this.item.bill_amount;
          } else
            this.item["billamt_updated"] = this.item.orderamt;

          if (this.item.messages) {
            let arr = [];
            for (let i = 0; i < this.item.messages.length; i++) {
              this.alertUtils.showLog(this.item.messages[i].ispublic);
              if (this.item.messages[i].ispublic == 0) {
                arr.push(this.item.messages[i]);
              }
            }
            this.item.messages = arr;
          }
          this.ref.detectChanges();
          this.alertUtils.showLog(this.item);

          this.getProductsByOrderId();
        }
      }, err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Do you want cancel this order?',
      message: 'Please write your comments',
      inputs: [
        {
          label: 'Comments',
          name: 'comments',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'SEND',
          handler: data => {

            this.alertUtils.showLog(data.comments);

            this.cancelJob(data.comments);

          }
        }
      ]
    });
    prompt.present();
  }

  cancelJob(s) {

    try {

      /*{"order":{"orderid":480,"customerid":6,"usertype":"customer",
      "orderstatus":"cancelled","reason":"Hi irder","loginid":6,"apptype":"carwash"}}*/

      let input = {
        "order": {
          orderid: this.item.order_id,
          "orderstatus": 'cancelled',
          'reason':s,
          "loginid": UtilsProvider.USER_ID,
          "user_type": UtilsProvider.USER_TYPE,
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.cancelOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res.data);
        this.alertUtils.showLog(res.data.message);

        if(res.result == RES_SUCCESS && res.data){
          this.alertUtils.showToast('Successfully cancelled');
          this.fetchOrderDetails();
        }else
          this.alertUtils.showToast('Something went wrong please try again');

      }, error => {

      })
    } catch (e) {

    }
  }

  getSuppliers() {

    try {
      let url = this.apiService.getSuppliers() + UtilsProvider.USER_ID + "/" + APP_TYPE + "/" + UtilsProvider.USER_TYPE;

      this.alertUtils.showLog(url);

      this.showProgress = true;
      this.apiService.getReq(url).then(res => {
        this.alertUtils.showLogRes(url, null, res);
        this.showProgress = false;

        this.suppliersList = [];
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i]["firstname"] = this.validate(res.data[i].firstname);
            res.data[i]["lastname"] = this.validate(res.data[i].lastname);

            if(res.data[i].availability == 1){
              this.item["statusColor"] = "primary";
              res.data[i]['activeStatus'] = true;
            }
            else{
              this.item["statusColor"] = "warning";
              res.data[i]['activeStatus'] = false;
            }


            this.suppliersList.push(res.data[i]);
          }

          this.openAssignForwardModal();
          /*if (this.item.orderby_latitude && this.item.orderby_longitude)
            this.openAssignForwardModal();
          else {
            if (this.platform.is('android') || this.platform.is('ios')){
              this.mapUtils.getNativeForwardGeocode(this.item.orderby_address).then((coordinates: NativeGeocoderForwardResult[]) => {
                  this.alertUtils.showLogs(coordinates[0].latitude);
                  this.alertUtils.showLogs(coordinates[0].longitude);
                  this.item.orderby_latitude = coordinates[0].latitude;
                  this.item.orderby_longitude = coordinates[0].longitude;
                  this.openAssignForwardModal();
                });
            }else
              this.openAssignForwardModal();
          }*/
        }
      }, error => {
        this.alertUtils.showLogErr(url, null, error);
      })
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }

  openAssignForwardModal() {
    let model = this.modalCtrl.create('DealerOrderDetailsAssignForwardPage', {
      suppliersList: this.suppliersList,
      distributorsList: this.distributorsList,
      orderInfo: this.item,
    }, {
      cssClass: 'dialogcustomstyle',
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {

          if (data.actionType == 'assign')
            this.alertUtils.showToast('Job assignment completed');
          else
            this.alertUtils.showToast('Job Forward completed');

          DealerOrdersOrderedPage.statusUpdated = true;

          this.fetchOrderDetails();

        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  editStatusModal() {
    let model = this.modalCtrl.create('DealerOrderDetailsEditStatusPage', {
      order: this.item,
    }, {
      cssClass: 'dialogcustomstyle',
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showToast('Order Delivered');
          this.fetchOrderDetails();
        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
  }

  getProductsByOrderId() {

    try {
      let input = {
        "root": {
          "userid": UtilsProvider.USER_ID,
          "orderid": this.orderId,
          "categoryid": this.categoryID,
          "loginid": UtilsProvider.USER_ID,
          "apptype": APP_TYPE,
        }
      };

      this.showProgress = true;
      this.apiService.postReq(this.apiService.getProductsByOrderId(), JSON.stringify(input)).then(res => {
        this.showProgress = false;
        this.alertUtils.showLog("POST (SUCCESS)=> PRODUCTS: " + JSON.stringify(res));
        this.productsList = res.data;


        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> PRODUCTS: " + error);
      })

    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }


  createMessage(item: any, message: string) {
    let input = {
      "order": {
        "orderid": item.order_id,
        "customerid": this.userID,
        "usertype": APP_USER_TYPE,
        "orderstatus": "Message",
        "reason": message,
        "ispublic": "0",
        "loginid": this.userID,
        "apptype": APP_TYPE
      }
    };
    this.alertUtils.showLog(JSON.stringify(input));
    let data = JSON.stringify(input);
    let myDate: string = new Date().toISOString();
    let sendMes = {
      "createddate": myDate,
      "message": message,
      "ispublic": "0",
      "user": {
        "firstname": UtilsProvider.USER_NAME, "lastname": "", "userid": this.userID
      }
    };
    this.alertUtils.showLog(this.item);
    this.showProgress = true;
    this.apiService.postReq(this.apiService.createMessageOnOrder(), data).then(res => {
      this.alertUtils.showLog(res);
      this.showProgress = false;
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Message sent successfully ");
        if (!this.item.messages)
          this.item.messages = [];
        this.item.messages.push(sendMes);
        this.editorMsg = "";
        this.scrollToBottom();
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
