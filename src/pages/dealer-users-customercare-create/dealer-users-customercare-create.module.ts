import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerUsersCustomercareCreatePage } from './dealer-users-customercare-create';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerUsersCustomercareCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerUsersCustomercareCreatePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DealerUsersCustomercareCreatePageModule {}
