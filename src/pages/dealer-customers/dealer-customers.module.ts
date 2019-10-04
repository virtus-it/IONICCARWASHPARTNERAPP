import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCustomersPage } from './dealer-customers';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerCustomersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCustomersPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerCustomersPageModule {}
