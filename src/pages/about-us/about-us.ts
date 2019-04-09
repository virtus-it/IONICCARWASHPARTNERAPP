import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private translateService: TranslateService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
    console.log('ionViewDidLoad AboutUsPage');
    console.log('ionViewDidLoad AboutUsPage');
    console.log('ionViewDidLoad AboutUsPage');
  }

}
