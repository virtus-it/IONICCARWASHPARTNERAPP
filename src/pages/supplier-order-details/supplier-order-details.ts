import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {
  AlertController,
  App,
  Content,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Platform
} from 'ionic-angular';
import {
  APP_TYPE,
  APP_USER_TYPE,
  IMAGE_HEIGHT, IMAGE_LENGTH,
  IMAGE_QUALITY,
  IMAGE_WIDTH,
  KEY_USER_INFO,
  OrderTypes,
  RES_SUCCESS,
  UserType,
  UtilsProvider
} from "../../providers/utils/utils";
import * as moment from 'moment';
import {ApiProvider} from "../../providers/api/api";
import {TranslateService} from '@ngx-translate/core';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {LocationUpdatesProvider} from "../../providers/location-updates/location-updates";


@IonicPage()
@Component({
  selector: 'page-supplier-order-details',
  templateUrl: 'supplier-order-details.html',
})
export class SupplierOrderDetailsPage {

  model: any;
  @ViewChild(Content) content: Content;

  item: any;
  rate: number = 0;
  showProgress = true;
  editorMsg: string = "";
  productsList: string[];
  preImg: string = '';
  postImg: string = '';
  private dealerID = "";
  private userID = "";
  private callFrom = "";
  private orderId = "";
  private categoryID = "";
  statusEnum: typeof  OrderTypes = OrderTypes;

  constructor(private modalCtrl: ModalController,
              private ref: ChangeDetectorRef,
              public appCtrl: App,
              public navCtrl: NavController,
              public param: NavParams,
              private locationUpdates: LocationUpdatesProvider,
              private photoViewer: PhotoViewer,
              public alertUtils: UtilsProvider,
              private translateService: TranslateService,
              public alertCtrl: AlertController,
              private camera: Camera,
              private platform: Platform,
              private apiService: ApiProvider
              ) {


    translateService.setDefaultLang('en');
    translateService.use('en');

    this.callFrom = this.param.get("callfrom");
    this.orderId = this.param.get("orderid");
    this.categoryID = this.param.get("categoryid");


    try {
      this.locationUpdates.startLocationUpdates();

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


            if (this.orderId)
              this.fetchOrderDetails();
            else
              this.alertUtils.showLog('order id is not found');
          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            this.userID = UtilsProvider.USER_ID;
            this.dealerID = UtilsProvider.USER_DEALER_ID;


            if (this.orderId)
              this.fetchOrderDetails();
            else
              this.alertUtils.showLog('order id is not found');
          }
        });
      });

      if (this.orderId) {
        this.preImg = this.apiService.getImg() + "pre_" + this.orderId+".png";
        this.postImg = this.apiService.getImg() + "post_" + this.orderId+".png";
      }

    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  updatePaymentType(s){
    if(s && s.paymenttype){
      if(s == 'cash' || s == 'cod')
        return 'cod';
      else
        return  s;
    }
    return  s;
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

  getDate(date){
    let myDate;
    if (date) {
      date = date.replace('T','');
      myDate = moment(date, 'YYYY-MM-DD hh:mm:ss').toDate()
      return moment(myDate).format("DD-MM-YY hh:mm");
    }
  }

  validate(s) {
    if(s){
      if(s == null || s == 'null')
        return '';
      else
        return s;
    }else
      return '';
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
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showLog(res.data[0]);
          this.item = res.data[0];

          this.rate = this.item.customerreview;

          if(!this.rate)
            this.rate = 0;

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
            this.item["orderstatus"] = "Assigned";
            this.item["trackingmessage"] = "Assigned";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "";
          } else if (this.item.status == "accept" || this.item.status == 'Accept' || this.item.status == 'Accepted') {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Accepted";
            this.item["trackingmessage"] = "Accepted";
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
            this.item.status == OrderTypes.BACKTODEALER ||
            this.item.status == OrderTypes.NOT_BROADCASTED) {

            this.item["orderstatus"] = "assigned";
            this.item["statusUpdated"] = "Order Assigned";
          } else if (this.item.status == OrderTypes.ACCEPT) {
            this.item["orderstatus"] = "accepted";
            this.item["statusUpdated"] = "Order Accepted";
          } else if (this.item.status == OrderTypes.ORDER_STARTED) {
            this.item["orderstatus"] = "orderstarted";
            this.item["statusUpdated"] = "Engineer started from his loc";
          } else if (this.item.status == OrderTypes.JOB_STARTED) {
            this.item["orderstatus"] = "jobstarted";
            this.item["statusUpdated"] = "Job Started";
          }else if (this.item.status == OrderTypes.JOB_COMPLETED) {
            this.item["orderstatus"] = "jobcompleted";
            this.item["statusUpdated"] = "Payment Pending";
          }else if (this.item.status == OrderTypes.ARRIVED) {
            this.item["orderstatus"] = "Arrived";
            this.item["statusUpdated"] = "You are at Customer loc";
          } else if (this.item.status == OrderTypes.DELIVERED) {
            this.item["orderstatus"] = "delivered";
            this.item["statusUpdated"] = "Job Completed";
          } else if (this.item.status == OrderTypes.CANCELLED) {
            this.item["orderstatus"] = "cancelled";
            this.item["statusUpdated"] = "Order Cancelled";
          } else if (this.item.status == OrderTypes.ONHOLD) {
            this.item["orderstatus"] = "onhold";
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

  pickImage(prePost) {
    try {
      let options: CameraOptions;
      if (this.platform.is('android')) {
        options = {
          quality: IMAGE_QUALITY,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.PNG,
          saveToPhotoAlbum: false,
          targetWidth: IMAGE_WIDTH,
          targetHeight: IMAGE_HEIGHT
        }
      } else if (this.platform.is('ios')) {
        options = {
          quality: IMAGE_QUALITY,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: this.camera.EncodingType.PNG,
          saveToPhotoAlbum: false,
          targetWidth: IMAGE_WIDTH,
          targetHeight: IMAGE_HEIGHT,
        }
      }

      this.camera.getPicture(options).then((imageData) => {
        if(this.calculateImageSize(imageData) < IMAGE_LENGTH ){
          this.uploadImg(imageData,prePost+'_'+this.item.order_id);
        }else
          this.alertUtils.showToast('Your image is too large, we updated job without image');
      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s,fileName){
    try {
      let input = {
        "image": {
          "filename": fileName,
          "base64string": s,
        }
      };

      this.showProgress = true;
      this.apiService.postReq(this.apiService.imgUpload(), JSON.stringify(input)).then(res => {
        this.showProgress = false;
        this.alertUtils.showLog(res);
        this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + res.data);

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showToast("Image uploaded successfully");
          //this.updateOrderStatus(order,'jobstarted');
        } else
          this.alertUtils.showToast(res.result);

      }, error => {
        this.alertUtils.showLog(error);
      })
    } catch (e) {
    }
  }

  changeOrderStatus(status){
    try{
      let canIExecute = false;
      if(status == 'arrived'){
        //cal for service agent location
        //validate if his loc < 30 meters
        canIExecute = true;
      }else{
        canIExecute = true;
      }

      if(canIExecute){
        let input = {
          "order": {
            "orderid": this.item.order_id,
            "status": status,
            "userid": UtilsProvider.USER_ID,
            "usertype": UserType.SUPPLIER,
            "loginid": UtilsProvider.USER_ID,
            "apptype": APP_TYPE
          }
        };

        this.alertUtils.showLog(JSON.stringify(input));

        this.showProgress = true;
        this.apiService.postReq(this.apiService.changeOrderStatus(), JSON.stringify(input)).then(res => {
          this.alertUtils.showLog(res);
          this.alertUtils.showLog("POST (SUCCESS)=> CHANGE ORDER STATUS: " + JSON.stringify(res.data));

          this.showProgress = false;
          if (res.result == this.alertUtils.RESULT_SUCCESS) {
            this.alertUtils.showToast('Job Completed');
            this.fetchOrderDetails();
            this.editStatusModal();
          } else
            this.alertUtils.showToast(res.result);

        }, error => {
          this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
        })
      }

      this.locationUpdates.sendLoctoDb(status);
    }catch (e) {

    }
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
          this.alertUtils.showToast('Payment received');
          this.locationUpdates.sendLoctoDb(OrderTypes.DELIVERED);
          this.fetchOrderDetails();
        } else {
          this.alertUtils.showToast('Some thing went wrong!');
        }
      }
    })
    model.present();
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

  calculateImageSize(base64String){
    let padding, inBytes, base64StringLength;
    if(base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    console.log(base64StringLength)
    inBytes =(base64StringLength / 4 ) * 3 - padding;
    console.log(inBytes);
    let kbytes = inBytes / 1000;
    return kbytes;
  }
}
