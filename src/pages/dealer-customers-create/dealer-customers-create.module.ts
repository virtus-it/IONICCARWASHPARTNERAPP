import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCustomersCreatePage } from './dealer-customers-create';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerCustomersCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCustomersCreatePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerCustomersCreatePageModule {}
