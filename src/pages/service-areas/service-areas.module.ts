import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServiceAreasPage } from './service-areas';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";


@NgModule({
  declarations: [
    ServiceAreasPage,
  ],
  imports: [
    IonicPageModule.forChild(ServiceAreasPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class ServiceAreasPageModule {}
