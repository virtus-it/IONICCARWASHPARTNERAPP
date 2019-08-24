import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsReportsPage } from './sms-reports';

@NgModule({
  declarations: [
    SmsReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(SmsReportsPage),
  ],
})
export class SmsReportsPageModule {}
