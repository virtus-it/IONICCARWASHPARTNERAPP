import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {AlertController, App, IonicPage, ModalController, NavController, NavParams, Content} from 'ionic-angular';
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG, OrderTypes,
  RES_SUCCESS, UserType,
  UtilsProvider
} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from '@ngx-translate/core';
import {DealerOrderDetailsAssignForwardPage} from "../dealer-order-details-assign-forward/dealer-order-details-assign-forward";
import {DealerOrderDetailsEditStatusPage} from "../dealer-order-details-edit-status/dealer-order-details-edit-status";

@IonicPage()
@Component({
  selector: 'page-supplier-order-details',
  templateUrl: 'supplier-order-details.html',
})
export class SupplierOrderDetailsPage {

  model: any;
  @ViewChild(Content) content: Content;
  testRadioResult: any;
  testRadioOpen: boolean;
  item: any;
  fetchDone: boolean = false;
  showProgress = true;
  tabBarElement: any;
  editorMsg: string = "";
  suppliersList: string[];
  distributorsList: string[];
  productsList: string[];
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private callFrom = "";
  private orderId = "";
  private categoryID = "";

  constructor(private modalCtrl: ModalController,
              private ref: ChangeDetectorRef,
              public appCtrl: App,
              public navCtrl: NavController,
              public param: NavParams,
              public alertUtils: UtilsProvider,
              private translateService: TranslateService,
              public alertCtrl: AlertController,
              private apiService: ApiProvider) {

    translateService.setDefaultLang('en');
    translateService.use('en');

    this.callFrom = this.param.get("callfrom");
    this.orderId = this.param.get("orderid");
    this.categoryID = this.param.get("categoryid");

    this.userID = UtilsProvider.USER_ID;
    this.dealerID = UtilsProvider.USER_DEALER_ID;


    if (this.orderId)
      this.fetchOrderDetails();
    else
      this.alertUtils.showLog('order id is not found');

  }
  fetchOrderDetails() {
    try {
      let url = this.apiService.getOrderDetails() + this.orderId + "/" + this.userID;

      this.apiService.getReq(url).then(res => {
        this.showProgress = false;
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showLog(res.data[0]);
          this.item = res.data[0];

          if(this.item.status == OrderTypes.DELIVERED){
            this.item["billamt_updated"] = res.data[0].bill_amount;
          }else
            this.item["billamt_updated"] = res.data[0].orderamt;


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
            this.item["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
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
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "";
          } else if (this.item.status == "delivered" || this.item.status == "Delivered") {
            this.item["orderstatus"] = "Delivered";
            this.item["statusColor"] = "success";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "success";
          } else if (this.item.status == "doorlock" || this.item.status == "Door Locked") {
            this.item["orderstatus"] = "Door Locked";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "Not delivered: Door - Locked";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "cannot_deliver" || this.item.status == "Cant Deliver") {
            this.item["orderstatus"] = "Cant Deliver";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "Not Reachable" || this.item.status == "not_reachable") {
            this.item["orderstatus"] = "Not Reachable";
            this.item["statusColor"] = "warning";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
            this.item["trackingmessage"] = "Your order is unable to deliver due to your un-availablity";
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
              this.item["statusUpdated"] = "Assigned to Service Engineer";
            else if(this.item.status == OrderTypes.ACCEPT)
              this.item["statusUpdated"] = "Order Accepted";
            else if(this.item.status == OrderTypes.ORDER_STARTED)
              this.item["statusUpdated"] = "Order Started";
          } else if (this.item.status == OrderTypes.DELIVERED) {
            this.item["orderstatus"] = "DELIVERED";
            this.item["statusUpdated"] = "Order Delivered";
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
            this.item["statusUpdated"] = "Order is On Hold";
          }

          //updating bill amount
          if(this.item.status == OrderTypes.DELIVERED){
            this.item["billamt_updated"] = this.item.bill_amount;
          }else
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

  assignForward(event) {
    this.getSuppliers();
  }

  openAssignForwardModal() {
    let model = this.modalCtrl.create('DealerOrderDetailsAssignForwardPage', {
      suppliersList: this.suppliersList,
      distributorsList: this.distributorsList,
      orderInfo: this.item,
    },{
      cssClass: 'dialogcustomstyle',
    })

    model.onDidDismiss(data => {
      if (data && data.hasOwnProperty('result')) {
        if (data.result == this.alertUtils.RESULT_SUCCESS) {

          if (data.actionType == 'assign')
            this.alertUtils.showToast('Order assignment completed');
          else
            this.alertUtils.showToast('Order Forward completed');

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
      order:this.item,
    },{
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

  getSuppliers() {

    try {


      let url = this.apiService.getSuppliers() + UtilsProvider.USER_ID + "/" + APP_TYPE;

      this.alertUtils.showLog(url);

      this.alertUtils.showLoading();
      this.apiService.getReq(url).then(res => {
        this.alertUtils.showLog(res);
        this.alertUtils.hideLoading();

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.suppliersList = res.data;

          this.openAssignForwardModal();
        }
      }, error => {
      })
    }catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }

  /*getDistributors() {

    try {
      let input = {
        "root": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.DEALER,
          "loginid": UtilsProvider.USER_ID,
          "lastuserid": '0',
          "apptype": APP_TYPE,
        }
      };

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.distributors(), JSON.stringify(input)).then(res => {
        this.alertUtils.showLog("POST (SUCCESS)=> DISTRIBUTORS: " + JSON.stringify(res.data));
        this.distributorsList = res.data;
        this.alertUtils.hideLoading();

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.openAssignForwardModal();
        }
        this.ref.detectChanges();
      }, error => {
        this.alertUtils.showLog("POST (ERROR)=> DISTRIBUTORS: " + error);
        this.alertUtils.hideLoading();
      })

    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.hideLoading();
    }
  }*/

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

      this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.getProductsByOrderId(), JSON.stringify(input)).then(res => {
        this.alertUtils.hideLoading();
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

  onHoldOrder(event){
    this.alertUtils.showLog('onhold order clicked');
    this.alertUtils.showToast('Clicked onhold order');
  }

  editStatus(event){
    this.alertUtils.showLog('edit status clicked');
    this.alertUtils.showToast('Clicked edit status');
  }

  /*cancelOrder(item) {
    // this.showRadio(item)
    this.model = this.modalCtrl.create('CancelOrderPage', {}, {
      showBackdrop: false,
      enableBackdropDismiss: false,
      cssClass: 'raiserequestdialog'
    });
    this.model.present();
    this.model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.cancelOrderTask(item.order_id, data)
        } else {
          this.alertUtils.showAlert("CONNECTION ERROR", INTERNET_ERR_MSG, "OK");
        }
      }
    });

  }

  cancelOrderTask(orderid: string, reason: string) {
    let input = {
      "order": {
        "orderid": orderid,
        "customerid": this.userID,
        "usertype": APP_USER_TYPE,
        "orderstatus": "cancelled",
        "reason": reason,
        "loginid": this.userID,
        "apptype": APP_TYPE
      }
    };
    this.alertUtils.showLog(JSON.stringify(input));
    let data = JSON.stringify(input);
    this.apiService.postReq(this.apiService.cancelOrder(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Order successfully cancelled");
        Utils.UPDATE_ORDER_LIST = true;
        this.item.status = "Cancelled";
        if (this.orderId)
          this.fetchOrderDetails();

      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }*/

  sendMessage(item) {
    // this.showPrompt(item)
    if (this.alertUtils.validateText(this.editorMsg, "Message", 3, 250)) {
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


  /*callNow(number) {
    this.alertUtils.callNumber(number);
  }*/


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
    this.apiService.postReq(this.apiService.createMessageOnOrder(), data).then(res => {
      this.alertUtils.showLog(res);
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
}