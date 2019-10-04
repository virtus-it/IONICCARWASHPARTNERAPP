import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerSuppliersPage } from './dealer-suppliers';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerSuppliersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerSuppliersPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerSuppliersPageModule {}
