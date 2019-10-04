import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerUsersCustomercarePage } from './dealer-users-customercare';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {createTranslateLoader} from "../../app/app.module";
import {HttpClient} from "@angular/common/http";

@NgModule({
  declarations: [
    DealerUsersCustomercarePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerUsersCustomercarePage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ],
})
export class DealerUsersCustomercarePageModule {}
