import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LatLng} from "@ionic-native/google-maps";
import {UtilsProvider} from "../utils/utils";
import {NativeGeocoder, NativeGeocoderOptions} from "@ionic-native/native-geocoder";
import {LocationTracker} from "../tracker/tracker";
declare var google;

@Injectable()
export class MapUtilsProvider {

  constructor(public http: HttpClient,
              private tracker:LocationTracker,
              private nativeGeocoder: NativeGeocoder,
              private alertUtils: UtilsProvider) {
    console.log('Hello MapUtilsProvider Provider');
  }


  getLatLngs(address: any) {
    try {
      let geocoder = new google.maps.Geocoder();
      return  geocoder.geocode({ 'address': address });
    } catch (e) {
      this.alertUtils.showLogs('Getting lat lngs from addr',e);
      return null;
    }
  }

  getNativeForwardGeocode(addr:any){
    try {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      return this.nativeGeocoder.forwardGeocode(addr, options);
    } catch (e) {
    }
  }

  findDistence(order:any){
    try {
      let loc =this.tracker.getLoc();
      var radlat1 = Math.PI * loc.lat/180;
      var radlat2 = Math.PI * order.orderby_latitude/180;
      var theta = loc.lng-order.orderby_longitude;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344

      this.alertUtils.showLogs('distence : ',dist);

      if(dist < 0.3){
        return true;
      }
      return false;

    }catch (e) {

    }
  }

}
