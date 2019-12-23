import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendNotificationsPage } from './send-notifications';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../../app/app.module";
import {HttpClient} from "@angular/common/http";
import {PipesModule} from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    SendNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendNotificationsPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    PipesModule,
  ],
})
export class SendNotificationsPageModule {}
