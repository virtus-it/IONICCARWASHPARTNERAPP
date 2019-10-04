import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsReportsPage } from './sms-reports';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    SmsReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(SmsReportsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class SmsReportsPageModule {}
