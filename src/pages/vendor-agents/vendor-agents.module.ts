import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorAgentsPage } from './vendor-agents';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    VendorAgentsPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorAgentsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class VendorAgentsPageModule {}
