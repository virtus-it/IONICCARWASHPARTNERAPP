import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrderDetailsPage } from './supplier-order-details';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SupplierOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierOrderDetailsPage),
    PipesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class SupplierOrderDetailsPageModule {}
