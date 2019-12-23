import {LoadingController} from 'ionic-angular';

import {CallWebserviceProvider} from "../providers/call-webservice/call-webservice";

import {EventEmitter} from "@angular/core";
import {UtilsProvider} from "../providers/utils/utils";


export abstract class AbstractPage {

  private loader;
  public static user;
  public isPaging:boolean;
  public event:EventEmitter<any>;

  constructor(public loadingCtrl: LoadingController,
              public webservice: CallWebserviceProvider) {
  }

  protected presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      cssClass: 'my-loading-class'
    });
    this.loader.present();
  }

  protected closeLoading() {
    if (this.loader !== null && this.loader !== undefined) {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  protected abstract webCallback(json, api, reqId);

  protected abstract handleError(json, reqId);

  protected callWebservice(reqId: any,api) {
    this.webservice.getResult(api).subscribe(
      output => {
        UtilsProvider.showLogReq(api, '',output);
        //let json = output.json();
        let json = output.json();
        this.webCallback(json, api, reqId);
      },
      err => {
        UtilsProvider.showLogErr(api, err);
        this.closeLoading();
        this.handleError(err,reqId)
      },
      () => {
        this.closeLoading();
      }
    );
  }

  protected postWebservice(reqId: any, api, input: any) {

    //UtilsProvider.showLogInfo('called - postWebservice', api, input);

    this.webservice.postResultWithParams(reqId, api, input).subscribe(
      output => {
        UtilsProvider.showLogReq( api, input, output);

        //let json = output.json();
        let json = output.json();
        this.webCallback(json, api, reqId);
      },
      err => {
        UtilsProvider.showLogErr( api, input, err);
        this.closeLoading();
        this.handleError(err,reqId);
      },
      () => {
        this.closeLoading();
      }
    );

  }
}
