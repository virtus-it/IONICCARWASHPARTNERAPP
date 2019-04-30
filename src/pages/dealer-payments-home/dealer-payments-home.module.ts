import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPaymentsHomePage } from './dealer-payments-home';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DealerPaymentsHomePage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerPaymentsHomePage),
  ],
})
export class DealerPaymentsHomePageModule {}
