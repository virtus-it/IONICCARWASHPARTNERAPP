import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDistributorsPage } from './dealer-distributors';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerDistributorsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDistributorsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerDistributorsPageModule {}
