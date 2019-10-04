import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCarModelsCreatePage } from './dealer-car-models-create';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerCarModelsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCarModelsCreatePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerCarModelsCreatePageModule {}
