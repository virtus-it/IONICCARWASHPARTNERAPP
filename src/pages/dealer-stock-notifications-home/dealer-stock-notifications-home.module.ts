import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerStockNotificationsHomePage } from './dealer-stock-notifications-home';

@NgModule({
  declarations: [
    DealerStockNotificationsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerStockNotificationsHomePage),
  ],
})
export class DealerStockNotificationsHomePageModule {}
