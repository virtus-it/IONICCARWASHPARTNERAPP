import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCategoryHomePage } from './dealer-category-home';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerCategoryHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCategoryHomePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerCategoryHomePageModule {}
