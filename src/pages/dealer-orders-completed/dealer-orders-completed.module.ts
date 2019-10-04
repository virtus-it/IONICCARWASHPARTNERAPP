import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersCompletedPage } from './dealer-orders-completed';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerOrdersCompletedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerOrdersCompletedPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerOrdersCompletedPageModule {}
