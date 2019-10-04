import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCarModelsPage } from './dealer-car-models';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerCarModelsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCarModelsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerCarModelsPageModule {}
