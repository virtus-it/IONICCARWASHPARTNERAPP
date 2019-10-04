import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDistributorsCreatePage } from './dealer-distributors-create';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerDistributorsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDistributorsCreatePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DealerDistributorsCreatePageModule {}
