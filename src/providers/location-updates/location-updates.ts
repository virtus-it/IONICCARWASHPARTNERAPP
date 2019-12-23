
import {Injectable, NgZone} from '@angular/core';
import {APP_TYPE, UtilsProvider} from "../utils/utils";
import {Geolocation, Geoposition} from "@ionic-native/geolocation";
import {BackgroundMode} from "@ionic-native/background-mode";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";
import {CallWebserviceProvider} from "../call-webservice/call-webservice";
import {ApiProvider} from "../api/api";

@Injectable()
export class LocationUpdatesProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  constructor(public zone: NgZone,
              private apiProvider : ApiProvider,
              private geolocation: Geolocation,
              private alertUtils: UtilsProvider,
              private backgroundMode: BackgroundMode,
              private webserice: CallWebserviceProvider) {

  }

  startLocationUpdates(){
    try {

      // Background location updates

     /* let config = {
        desiredAccuracy: 0,
        stationaryRadius: 20,
        distanceFilter: 0,
        debug: false, //sound turn off
        //interval: 100
      };

      this.backgroundGeolocation.configure(config).subscribe((location) => {
        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = location.latitude;
          this.lng = location.longitude;
        });

      }, (err) => {

        this.alertUtils.showLog(err);

      });

      // Turn ON the background-geolocation system.
      this.backgroundGeolocation.start();*/


      // Foreground location updates

      let options = {
        //frequency: 3000,
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
    } catch (e) {
    }
  }

  sendLoctoDb(status, id?){

    if(this.lat && this.lat != 0 && this.lng && this.lng != 0){
      /* {"root":{"transtype":"orderstarted","latitude":"17.42","longitude":"78.42",
   "address":"shaikpet","loginid":"33","userid":"33"}}*/

      let input = {
        "root": {
          transtype: status,
          latitude : this.lat,
          longitude: this.lng,
          loginid: id ? id : UtilsProvider.USER_ID,
          userid: id ? id : UtilsProvider.USER_ID,
          apptype: APP_TYPE
        }
      };

      let api = this.apiProvider.locationUpdate();
      this.webserice.postResult(api, JSON.stringify(input)).subscribe(
        output => {
          UtilsProvider.showLogReq(api, JSON.stringify(input), output);
          this.alertUtils.showLog('loc updates : success');
          //let json = output.json();
        },
        err => {
          UtilsProvider.showLogErr( api, JSON.stringify(input), err);
          this.alertUtils.showLog('loc updates : failed');
        },
        () => {
        }
      );
    }
  }
}
