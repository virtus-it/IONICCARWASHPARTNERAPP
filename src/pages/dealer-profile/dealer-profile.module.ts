import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerProfilePage } from './dealer-profile';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";


@NgModule({
  declarations: [
    DealerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerProfilePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerProfilePageModule {}
