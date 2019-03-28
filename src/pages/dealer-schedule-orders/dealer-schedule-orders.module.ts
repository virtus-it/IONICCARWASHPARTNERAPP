import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerScheduleOrdersPage } from './dealer-schedule-orders';

@NgModule({
  declarations: [
    DealerScheduleOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerScheduleOrdersPage),
  ],
})
export class DealerScheduleOrdersPageModule {}
