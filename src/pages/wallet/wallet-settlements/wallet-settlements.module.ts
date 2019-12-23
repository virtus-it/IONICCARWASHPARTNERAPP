import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletSettlementsPage } from './wallet-settlements';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {PipesModule} from "../../../pipes/pipes.module";
import {createTranslateLoader} from "../../../app/app.module";

@NgModule({
  declarations: [
    WalletSettlementsPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletSettlementsPage),
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
export class WalletSettlementsPageModule {}
