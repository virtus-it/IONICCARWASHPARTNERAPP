import { Injectable } from '@angular/core';
import {UtilsProvider} from "../utils/utils";
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder";

@Injectable()
export class GeocoderProvider {

  constructor(private nativeGeocoder: NativeGeocoder,
              private alertUtils: UtilsProvider) {
  }


  reverseGeocode(lat:number,lng:number){
    try {
      if (lat && lng) {
        return this.nativeGeocoder.reverseGeocode(lat, lng, this.getOptions());
      }
    } catch (e) {
      this.alertUtils.showLog(e);
      return null;
    }
    return null;
  }

  forwardGeocode(addr:string){
    try {
      if (addr) {
        return this.nativeGeocoder.forwardGeocode(addr,this.getOptions());
      }
    } catch (e) {
      this.alertUtils.showLog(e);
      return null;
    }
    return null;
  }

  getOptions(){
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    return options;
  }

}
