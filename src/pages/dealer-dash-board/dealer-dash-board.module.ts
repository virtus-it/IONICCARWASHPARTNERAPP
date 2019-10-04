import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDashBoardPage } from './dealer-dash-board';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerDashBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDashBoardPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerDashBoardPageModule {}
