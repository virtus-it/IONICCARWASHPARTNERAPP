import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersOrderedPage } from './dealer-orders-ordered';
import {PipesModule} from "../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerOrdersOrderedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerOrdersOrderedPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerOrdersOrderedPageModule {}
