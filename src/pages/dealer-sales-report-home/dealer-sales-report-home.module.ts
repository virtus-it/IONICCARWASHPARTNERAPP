import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerSalesReportHomePage } from './dealer-sales-report-home';

@NgModule({
  declarations: [
    DealerSalesReportHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerSalesReportHomePage),
  ],
})
export class DealerSalesReportHomePageModule {}
