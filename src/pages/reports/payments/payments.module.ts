import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentsPage } from './payments';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../../app/app.module";
import {HttpClient} from "@angular/common/http";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    PaymentsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    PipesModule,
  ],
})
export class PaymentsPageModule {}
