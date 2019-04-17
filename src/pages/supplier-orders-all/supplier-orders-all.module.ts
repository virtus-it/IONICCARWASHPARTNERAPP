import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersAllPage } from './supplier-orders-all';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SupplierOrdersAllPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SupplierOrdersAllPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class SupplierOrdersAllPageModule {}
