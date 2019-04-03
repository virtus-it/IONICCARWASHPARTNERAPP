import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrderDetailsPage } from './dealer-order-details';
import {HttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DealerOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOrderDetailsPage),
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
export class DealerOrderDetailsPageModule {}
