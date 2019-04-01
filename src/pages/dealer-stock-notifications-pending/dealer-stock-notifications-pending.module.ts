import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerStockNotificationsPendingPage } from './dealer-stock-notifications-pending';

@NgModule({
  declarations: [
    DealerStockNotificationsPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerStockNotificationsPendingPage),
  ],
})
export class DealerStockNotificationsPendingPageModule {}
