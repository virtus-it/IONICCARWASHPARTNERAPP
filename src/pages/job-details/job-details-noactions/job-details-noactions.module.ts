import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobDetailsNoactionsPage } from './job-details-noactions';
import {PipesModule} from "../../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    JobDetailsNoactionsPage,
  ],
  imports: [
    IonicPageModule.forChild(JobDetailsNoactionsPage),
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
export class JobDetailsNoactionsPageModule {}
