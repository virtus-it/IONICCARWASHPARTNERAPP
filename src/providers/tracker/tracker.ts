import {Injectable, NgZone} from '@angular/core';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation';
import {Geolocation, Geoposition} from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import {Socket} from "ng-socket-io";
import {APP_TYPE, KEY_TRACKING_ORDER, KEY_TRACKING_STATUS, UserType, UtilsProvider} from "../utils/utils";
import {Observable, Subscription} from "rxjs";
import {BackgroundMode} from "@ionic-native/background-mode";
declare var cordova;

@Injectable()
export class LocationTracker {

  public watch: any;
  public socketInit: Socket;
  public lat: number = 0;
  public lng: number = 0;
  private order: any;
  sub: Subscription;


  constructor(public zone: NgZone,
              private socket: Socket,
              private geolocation: Geolocation,
              private alertUtils: UtilsProvider,
              private backgroundMode: BackgroundMode,
              private backgroundGeolocation: BackgroundGeolocation) {
    this.socketInit = socket;
  }

  startTracking(order) {
    this.alertUtils.showLog("startedTracking");
    this.order = order;

    this.alertUtils.showLog("order info start");
    this.alertUtils.showLog(this.order);
    this.alertUtils.showLog("order info end");

    if (this.order.order_id) {

      this.backgroundMode.enable();
      this.backgroundMode.on('activate');
      this.backgroundMode.disableWebViewOptimizations();

      this.connectSocket();

      this.trackingUpdate();

      // Background Tracking

      let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 0,
        debug: false, //sound turn off
        interval: 100
      };

      this.backgroundGeolocation.configure(config).subscribe((location) => {

        this.alertUtils.showLog('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
        });

      }, (err) => {

        this.alertUtils.showLog(err);

      });

      // Turn ON the background-geolocation system.
      this.backgroundGeolocation.start();


      // Foreground Tracking

      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

        this.alertUtils.showLog(position);

        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });

      });


      try{
        this.alertUtils.setSecureValue(KEY_TRACKING_STATUS, true);
        this.alertUtils.setSecureValue(KEY_TRACKING_ORDER, this.order);
      }catch (e) {
        this.alertUtils.showLog(e);
      }

    }

  }

  trackingUpdate() {
    try {
      this.alertUtils.showLog("trackingUpdate - Initiated");
      this.sub = Observable.interval(10000).subscribe((val) => {

        this.alertUtils.showLog("lat : " + this.lat);
        this.alertUtils.showLog("lng : " + this.lng);
        this.alertUtils.showLog("order : " + this.order);
        if (this.lat && this.lng && this.order.order_id && this.order.useruniqueid) {
          this.sendObjToSocket();
        } else {
          this.alertUtils.getSecValue(KEY_TRACKING_ORDER).then((value => {
            this.order = value;
            this.alertUtils.showLog('order obj get from sf');
            this.alertUtils.showLog(this.order);

            if (this.order.order_id && this.order.useruniqueid) {
              this.sendObjToSocket();
            }
          }));
        }

      });

    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  sendObjToSocket() {
    try {
      this.alertUtils.showLog(this.lat, this.lng);
      this.alertUtils.showLog(this.order.order_id);
      this.alertUtils.showLog(this.order.useruniqueid);

      if (this.lat && this.lng && this.order) {
        this.socketInit.emit("carwashserviceenginerstarted",
          {
            "order": {
              "orderid": this.order.order_id,
              "lat": this.lat,
              "lng": this.lng,
              "uuid": this.order.useruniqueid,
              "userid": UtilsProvider.USER_ID,
              "usertype": UserType.SUPPLIER,
              "loginid": UtilsProvider.USER_ID,
              "time": this.alertUtils.getTodayDate(),
              "apptype": APP_TYPE
            }
          });
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  stopTracking() {
    this.alertUtils.showLog('stopTracking');

    this.backgroundMode.disable();

    this.alertUtils.setSecureValue(KEY_TRACKING_STATUS, false);
    this.alertUtils.setSecureValue(KEY_TRACKING_ORDER, "");

    this.backgroundGeolocation.finish();
    if(this.watch)
    this.watch.unsubscribe();
    if(this.sub)
    this.sub.unsubscribe();
  }

  disconnectSocket() {
    if (this.socketInit)
      this.socketInit.disconnect();
  }

  connectSocket() {
    this.socketInit.connect();
  }

}
