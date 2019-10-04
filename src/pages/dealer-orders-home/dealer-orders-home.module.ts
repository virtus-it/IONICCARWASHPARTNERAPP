import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersHomePage } from './dealer-orders-home';
import {SuperTabsModule} from "ionic2-super-tabs";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerOrdersHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOrdersHomePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SuperTabsModule
  ],
})
export class DealerOrdersHomePageModule {}
