import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {
  APP_TYPE,
  FRAMEWORK, IMAGE_HEIGHT,
  IMAGE_QUALITY, IMAGE_WIDTH,
  KEY_USER_INFO,
  OrderTypes,
  UserType,
  UtilsProvider
} from "../../providers/utils/utils";
import {ApiProvider} from "../../providers/api/api";
import 'rxjs/add/observable/interval';
import {Geolocation} from "@ionic-native/geolocation";

import { Camera, CameraOptions } from '@ionic-native/camera';
import { BackgroundMode } from '@ionic-native/background-mode';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import {LocationTracker} from "../../providers/tracker/tracker";


@IonicPage()
@Component({
  selector: 'page-supplier-orders-pending',
  templateUrl: 'supplier-orders-pending.html',
})
export class SupplierOrdersPendingPage {

  showProgress = true;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private apiService: ApiProvider,
              private geolocation: Geolocation,
              private camera: Camera,
              private tracker: LocationTracker,
              private platform: Platform,
              private backgroundMode: BackgroundMode,
              private backgroundGeolocation: BackgroundGeolocation,
              private appCtrl: App) {

    this.showProgress = false;

    try {
      this.platform.ready().then(ready => {
        this.alertUtils.getSecValue(KEY_USER_INFO).then((value) => {
          this.alertUtils.showLog(value);
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false, false, true, "", "");

          }
        }, (error) => {
          let value = UtilsProvider.USER_INFO
          if (value && value.hasOwnProperty('USERTYPE')) {
            UtilsProvider.setUSER_INFO(value);
            this.alertUtils.initUser(value);

            //initial call
            this.fetchOrders(false, false, true, "", "");

          }
        });
      });


    } catch (e) {
      this.alertUtils.showLog(e);
    }

   // this.getLocation(0);
  }

  ionViewDidLoad() {
     }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.SUPPLIER,
          "status": 'pending',
          "pagesize": '10',
          "framework": FRAMEWORK,
          "apptype": APP_TYPE
        }
      };

      if (isPaging) {
        input.order["last_orderid"] = this.response[this.response.length - 1].order_id;
      } else {
        input.order["last_orderid"] = '0';
      }

      let data = JSON.stringify(input);
      if (isFirst) {
        this.showProgress = true;
      }

      //this.alertUtils.showLoading();
      this.apiService.postReq(this.apiService.orderByStatus(), data).then(res => {
        this.alertUtils.hideLoading();
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog("POST (SUCCESS)=> ORDERS: ORDERED : " + JSON.stringify(res));

        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;

          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {

            if (res.data[i].status == OrderTypes.ORDERED ||
              res.data[i].status == OrderTypes.ASSIGNED ||
              res.data[i].status == OrderTypes.BACKTODEALER ||
              res.data[i].status == OrderTypes.NOT_BROADCASTED) {

              res.data[i]["orderstatus"] = "assigned";
              res.data[i]["statusUpdated"] = "Job Assigned";
            } else if (res.data[i].status == OrderTypes.ACCEPT) {
              res.data[i]["orderstatus"] = "accepted";
              res.data[i]["statusUpdated"] = "Job Accepted";
            } else if (res.data[i].status == OrderTypes.ORDER_STARTED) {
              res.data[i]["orderstatus"] = "orderstarted";
              res.data[i]["statusUpdated"] = "You started to visit";
            } else if (res.data[i].status == OrderTypes.JOB_STARTED) {
              res.data[i]["orderstatus"] = "jobstarted";
              res.data[i]["statusUpdated"] = "Job Started";
            } else if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["orderstatus"] = "delivered";
              res.data[i]["statusUpdated"] = "Job Completed";
            } else if (res.data[i].status == OrderTypes.CANCELLED) {
              res.data[i]["orderstatus"] = "cancelled";
              res.data[i]["statusUpdated"] = "Job Cancelled";
            } else if (res.data[i].status == OrderTypes.ONHOLD) {
              res.data[i]["orderstatus"] = "onhold";
              res.data[i]["statusUpdated"] = "Job is On Hold";
            }

            if (isPaging)
              this.response.push(res.data[i]);
          }
        }

      }, error => {
        this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
      });

    } catch (e) {
      this.hideProgress(isFirst, isRefresh, isPaging, paging, refresher);
    }
  }

  doRefresh(refresher) {
    this.fetchOrders(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchOrders(true, false, false, paging, "");
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
  }

  hideProgress(isFirst, isRefresh, isPaging, paging, refresher) {
    if (isFirst) {
      this.showProgress = false;
    }
    if (isPaging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }

  }

  viewDetails(event, orderID, categoryID) {
    if (orderID) {
      this.appCtrl.getRootNav().push('SupplierOrderDetailsPage', {
        orderid: orderID,
        categoryid: categoryID,
      });
    }
  }

  updateOrderStatus(order, status) {
    try {

      let canIExecute = true;

      if (status == 'orderstarted') {
        canIExecute = false;

        if(this.alertUtils.location.latitude && this.alertUtils.location.longitude){
          canIExecute = true;
        }else {
          canIExecute = false;
          this.alertUtils.getCurrentLocation().then((data) => {
            this.alertUtils.showLog("Data : "+data);
            if (data && data.coords && data.coords.latitude && data.coords.longitude) {
              this.alertUtils.location.latitude = (data.coords.latitude).toString();
              this.alertUtils.location.longitude = (data.coords.longitude).toString();
              canIExecute = true;
            }
          }).catch((error) => {
            console.log('Error getting location', error);
          });
          canIExecute = true;
        }


      }else if(status == 'jobstarted'){
        //tracking should be trun off using Subscription object
        this.alertUtils.stopSubscription();
        this.tracker.stopTracking();
        this.tracker.disconnectSocket();
      }

      if(canIExecute) {

        let input = {
          "order": {
            "orderid": order.order_id,
            "status": status,
            "lat": this.alertUtils.location.latitude,
            "lng": this.alertUtils.location.longitude,
            "userid": UtilsProvider.USER_ID,
            "usertype": UserType.SUPPLIER,
            "loginid": UtilsProvider.USER_ID,
            "apptype": APP_TYPE
          }
        };

        this.alertUtils.showLog(JSON.stringify(input));

        //this.alertUtils.showLoading();
        this.showProgress = true;
        this.apiService.postReq(this.apiService.changeOrderStatus(), JSON.stringify(input)).then(res => {
          this.alertUtils.showLog(res);
          this.alertUtils.showLog("POST (SUCCESS)=> CHANGE ORDER STATUS: " + JSON.stringify(res.data));
          //this.alertUtils.hideLoading();
          this.showProgress = false;

          if (res.result == this.alertUtils.RESULT_SUCCESS) {
            if (status == 'accept')
              this.alertUtils.showToast('Order accepted');
            else if (status == 'backtodealer')
              this.alertUtils.showToast('Order rejected');
            else if (status == 'orderstarted') {
              this.alertUtils.showLog('order started');
              this.alertUtils.showToast('Tracking Initialized');
              this.tracker.startTracking(order);
            } else if (status == 'jobstarted') {
              this.alertUtils.showLog('job started');
              this.alertUtils.stopSubscription();
              this.tracker.stopTracking();
              this.tracker.disconnectSocket();
            }
          } else
            this.alertUtils.showToast(res.result);

          this.fetchOrders(false, false, false, '', '');

        }, error => {
          this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
        })
      }
    } catch (e) {
      this.alertUtils.showLog(e);
      this.showProgress = false;
      //this.alertUtils.hideLoading();
    }

    this.showProgress = false;
  }

  pickImage(order,prePost) {
    this.alertUtils.showLog(order.order_id);
    try {
      const options: CameraOptions = {
        quality: IMAGE_QUALITY,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: IMAGE_WIDTH,
        targetHeight: IMAGE_HEIGHT
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image =  imageData;

        if(base64Image && base64Image.length>0){
          this.uploadImg(base64Image,prePost+'_'+order.order_id,order);
        }

      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s,fileName,order){
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
  }

}
