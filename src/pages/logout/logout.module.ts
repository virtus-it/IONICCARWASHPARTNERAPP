import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoutPage } from './logout';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    LogoutPage,
  ],
  imports: [
    IonicPageModule.forChild(LogoutPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class LogoutPageModule {}
