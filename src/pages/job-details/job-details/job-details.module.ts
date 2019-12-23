import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobDetailsPage } from './job-details';
import {PipesModule} from "../../../pipes/pipes.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    JobDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(JobDetailsPage),
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
export class JobDetailsPageModule {}
