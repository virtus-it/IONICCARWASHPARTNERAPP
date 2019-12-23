import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReconcilePage } from './reconcile';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    ReconcilePage,
  ],
  imports: [
    IonicPageModule.forChild(ReconcilePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class ReconcilePageModule {}
