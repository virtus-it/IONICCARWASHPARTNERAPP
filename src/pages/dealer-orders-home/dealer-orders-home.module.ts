import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersHomePage } from './dealer-orders-home';
import {SuperTabsModule} from "ionic2-super-tabs";

@NgModule({
  declarations: [
    DealerOrdersHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOrdersHomePage),
    SuperTabsModule
  ],
})
export class DealerOrdersHomePageModule {}
