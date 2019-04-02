import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerStockNotificationsHomePage } from './dealer-stock-notifications-home';
import {SuperTabsModule} from "ionic2-super-tabs";

@NgModule({
  declarations: [
    DealerStockNotificationsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerStockNotificationsHomePage),
    SuperTabsModule,
  ],
})
export class DealerStockNotificationsHomePageModule {}
