
import { Injectable } from '@angular/core';
import {Http, Headers} from "@angular/http";
import {APP_TYPE, APP_USER_TYPE, IS_WEBSITE} from "../utils/utils";

@Injectable()
export class CallWebserviceProvider {

  constructor(public http: Http) {
  }

  getResult(api) {
    let headers = this.getHeaders();
    return this.http.get(api, { headers: headers });
  }

  postResult(api,data) {
    let headers = this.getHeaders();
    return this.http.post(api, data, { headers: headers });
  }

  postResultWithParams(reqId: any, api, data: any) {
    let headers = this.getHeaders();
    return this.http.post(api, data, { headers: headers });
  }

  getHeaders(){
    let headers;
     if (IS_WEBSITE) {
    headers = new Headers({'Content-Type': 'application/json'});
    } else {
      headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("module", "carservicepartner");
      headers.append("apptype", APP_TYPE);
      headers.append("usertype", APP_USER_TYPE);
    }
    return headers;
  }

}
