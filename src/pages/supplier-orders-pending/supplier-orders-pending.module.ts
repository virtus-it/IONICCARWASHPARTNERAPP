import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersPendingPage } from './supplier-orders-pending';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";
@NgModule({
  declarations: [
    SupplierOrdersPendingPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SupplierOrdersPendingPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class SupplierOrdersPendingPageModule {}
