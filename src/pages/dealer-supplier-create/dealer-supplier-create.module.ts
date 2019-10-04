import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerSupplierCreatePage } from './dealer-supplier-create';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerSupplierCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerSupplierCreatePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerSupplierCreatePageModule {}
