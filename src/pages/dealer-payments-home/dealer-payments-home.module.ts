import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPaymentsHomePage } from './dealer-payments-home';

@NgModule({
  declarations: [
    DealerPaymentsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPaymentsHomePage),
  ],
})
export class DealerPaymentsHomePageModule {}
