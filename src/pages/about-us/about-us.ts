import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {UtilsProvider} from "../../providers/utils/utils";

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  test;
  buildVersion: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertUtils: UtilsProvider,
              private translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');


    let verCode, verName;
    this.alertUtils.getVersionCode().then(code => {
      verCode = code;
    }).catch(err => {
      this.alertUtils.showLog(err)
    });
    this.alertUtils.getVersionNumber().then(num => {
      verName = num;
      this.buildVersion = verName + " - " + verCode;
    }).catch(err => {
      this.alertUtils.showLog(err)
    });
  }

}
