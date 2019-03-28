import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersPendingPage } from './dealer-orders-pending';

@NgModule({
  declarations: [
    DealerOrdersPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOrdersPendingPage),
  ],
})
export class DealerOrdersPendingPageModule {}
