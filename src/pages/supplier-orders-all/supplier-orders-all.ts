import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { APP_TYPE, FRAMEWORK, OrderTypes, UserType, UtilsProvider } from "../../providers/utils/utils";
import { ApiProvider } from "../../providers/api/api";
import 'rxjs/add/observable/interval';
import { Observable, Subscription } from "rxjs";
import { Geolocation } from '@ionic-native/geolocation';
import { Socket } from 'ng-socket-io';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-supplier-orders-all',
  templateUrl: 'supplier-orders-all.html',
})
export class SupplierOrdersAllPage {

  showProgress = true;
  sub: Subscription;
  private response: any;
  private noRecords = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertUtils: UtilsProvider,
    private apiService: ApiProvider,
    private geolocation: Geolocation,
    private socket: Socket,
    private camera: Camera,
    private appCtrl: App) {
  }

  ionViewDidLoad() {
    this.fetchOrders(false, false, true, "", "");
  }

  fetchOrders(isPaging: boolean, isRefresh: boolean, isFirst: boolean, paging, refresher) {
    try {

      let input = {
        "order": {
          "userid": UtilsProvider.USER_ID,
          "usertype": UserType.SUPPLIER,
          "status": 'all',
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
              res.data[i]["statusUpdated"] = "Order Assigned";
            } else if (res.data[i].status == OrderTypes.ACCEPT) {
              res.data[i]["orderstatus"] = "accepted";
              res.data[i]["statusUpdated"] = "Order Accepted";
            } else if (res.data[i].status == OrderTypes.ORDER_STARTED) {
              res.data[i]["orderstatus"] = "orderstarted";
              res.data[i]["statusUpdated"] = "Engineer started from his loc";
            } else if (res.data[i].status == OrderTypes.JOB_STARTED) {
              res.data[i]["orderstatus"] = "jobstarted";
              res.data[i]["statusUpdated"] = "Job Started";
            } else if (res.data[i].status == OrderTypes.DELIVERED) {
              res.data[i]["orderstatus"] = "delivered";
              res.data[i]["statusUpdated"] = "Order Delivered";
            } else if (res.data[i].status == OrderTypes.CANCELLED) {
              res.data[i]["orderstatus"] = "cancelled";
              res.data[i]["statusUpdated"] = "Order Cancelled";
            } else if (res.data[i].status == OrderTypes.ONHOLD) {
              res.data[i]["orderstatus"] = "onhold";
              res.data[i]["statusUpdated"] = "Order is On Hold";
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

  updateOrderStatus(event, i, status) {
    try {

      let canIExecute = true;

      if (status == 'orderstarted') {
        canIExecute = false;
        this.alertUtils.getCurrentLocation().then((data) => {
          if(data && data.coords && data.coords.latitude && data.coords.longitude) {
            this.alertUtils.location.latitude   = (data.coords.latitude).toString();
            this.alertUtils.location.longitude  = (data.coords.longitude).toString();
            canIExecute = true;
          }else
            canIExecute = true;
        }).catch((error) => {
          console.log('Error getting location', error);
        });

      }else if(status == 'jobstarted'){
        //tracking should be trun off using Subscription object
        this.alertUtils.stopSubscription();
      }

      if(canIExecute) {

        let input = {
          "order": {
            "orderid": this.response[i].order_id,
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

        this.alertUtils.showLoading();
        this.apiService.postReq(this.apiService.changeOrderStatus(), JSON.stringify(input)).then(res => {
          this.alertUtils.showLog("POST (SUCCESS)=> CHANGE ORDER STATUS: " + JSON.stringify(res.data));
          this.alertUtils.hideLoading();

          if (res.result == this.alertUtils.RESULT_SUCCESS) {
            if (status == 'accept')
              this.alertUtils.showToast('Order accepted');
            else if (status == 'backtodealer')
              this.alertUtils.showToast('Order rejected');
            else if (status == 'orderstarted') {
              this.alertUtils.showLog('order started');
              this.getLocation(i);
            } else if (status == 'jobstarted') {
              this.alertUtils.showLog('job started');
              this.alertUtils.stopSubscription();
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
      this.alertUtils.hideLoading();
    }
  }

  getLocation(i) {
    this.alertUtils.showToast('Tracking Initialized');
    this.sub = Observable.interval(10000).subscribe((val) => {
      try {
        let watch = this.geolocation.watchPosition({ maximumAge: 0, timeout: 10000, enableHighAccuracy: true });
        watch.subscribe((data) => {
          try {
            if (data && data.coords && data.coords.latitude && data.coords.longitude) {
              this.alertUtils.showLog("lat : " + data.coords.latitude + "\nlog : " + data.coords.longitude + "\n" + new Date());
              this.trackingUpdate(data, i);
            }
          } catch (e) {
            this.alertUtils.showLog(e);
          }
        });

      } catch (e) {
        this.alertUtils.showLog(e);
      }
      this.alertUtils.setSubscription(this.sub);
    }, (error) => {
      this.alertUtils.showLog("error");
    })
  }

  trackingUpdate(data, i) {
    try {
      this.socket.connect();
      this.socket.emit("carwashserviceenginerstarted",
        {
          "order":{
            "orderid": this.response[i].order_id,
            "lat": data.coords.latitude,
            "lng": data.coords.longitude,
            "uuid": this.response[i].useruniqueid,
            "userid": UtilsProvider.USER_ID,
            "usertype": UserType.SUPPLIER,
            "loginid": UtilsProvider.USER_ID,
            "apptype": APP_TYPE
          }
        });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  pickImage(order,prePost) {
    this.alertUtils.showLog(order.order_id);
    try {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 100,
        targetHeight: 100
      };


      this.camera.getPicture(options).then((imageData) => {
        let base64Image = 'data:image/png;base64,' + imageData;

        if(base64Image && base64Image.length>0){
          this.uploadImg(base64Image,prePost+'_'+order.order_id);
        }

      }, (err) => {
        // Handle error
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  uploadImg(s,fileName){
    let input = {
      "image": {
        "filename": fileName,
        "base64string": s,
      }
    };

    this.showProgress = true;
    this.apiService.postReq('http://104.211.247.42:2250/uploadimg', JSON.stringify(input)).then(res => {
      this.showProgress = false;
      this.alertUtils.showLog("POST (SUCCESS)=> IMAGE UPLOAD: " + JSON.stringify(res.data));

      if (res.result == this.alertUtils.RESULT_SUCCESS) {

      } else
        this.alertUtils.showToast(res.result);

    }, error => {
      this.alertUtils.showLog("POST (ERROR)=> CHANGE ORDER STATUS: " + error);
    })
  }

}
