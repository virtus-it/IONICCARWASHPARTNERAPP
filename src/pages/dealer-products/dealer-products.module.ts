import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerProductsPage } from './dealer-products';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerProductsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerProductsPageModule {}
