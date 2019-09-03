import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LatLng} from "@ionic-native/google-maps";
import {UtilsProvider} from "../utils/utils";
declare var google;

@Injectable()
export class MapUtilsProvider {

  constructor(public http: HttpClient,
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

}
