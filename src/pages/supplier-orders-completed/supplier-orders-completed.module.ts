import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersCompletedPage } from './supplier-orders-completed';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    SupplierOrdersCompletedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SupplierOrdersCompletedPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class SupplierOrdersCompletedPageModule {}
