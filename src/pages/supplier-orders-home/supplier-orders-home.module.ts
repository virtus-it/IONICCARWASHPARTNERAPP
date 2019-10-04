import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersHomePage } from './supplier-orders-home';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    SupplierOrdersHomePage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierOrdersHomePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class SupplierOrdersHomePageModule {}
