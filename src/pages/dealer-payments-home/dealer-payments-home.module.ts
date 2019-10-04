import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPaymentsHomePage } from './dealer-payments-home';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerPaymentsHomePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerPaymentsHomePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerPaymentsHomePageModule {}
