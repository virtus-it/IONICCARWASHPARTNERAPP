import { Injectable } from '@angular/core';

export const APP_VER_CODE: string = "4";
import "rxjs/add/operator/map";
import {APP_TYPE, APP_USER_TYPE, IS_WEBSITE, UtilsProvider} from "../utils/utils";
import {Http, RequestOptions, Headers} from "@angular/http";


@Injectable()
export class NetworkProvider {

  http: any;

  constructor(http: Http, private alertUtils: UtilsProvider) {
    this.http = http;
  }

  getReq(url) {
    this.alertUtils.showLog(url);
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "woccustomer");
      headers.append("framework", "wocioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);
    }

    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options).map(res => res.json()).toPromise();
  }

  getReqForMap(url) {
    this.alertUtils.showLog("/" + url);
    return this.http.get(url).map(res => res.json());
  }

  postReq(url: string, input) {

    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "woccustomer");
      headers.append("framework", "wocioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });
    this.alertUtils.showLog(url);
    this.alertUtils.showLog(input);
    return this.http.post(url, input, options).map(res => res.json()).toPromise();
  }

  putReq(url: string, input) {
    let headers;
    if (IS_WEBSITE) {
      headers = new Headers({ 'Content-Type': 'application/json' });
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "woccustomer");
      headers.append("framework", "wocioniccustomer");
      headers.append("devicetype", "android");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
      headers.append("moyaversioncode", APP_VER_CODE);

    }
    this.alertUtils.showLog(JSON.stringify(headers));
    let options = new RequestOptions({ headers: headers });

    this.alertUtils.showLog(input);
    return this.http.put( url, input, options).map(res => res.json())
      .toPromise();
  }
}
