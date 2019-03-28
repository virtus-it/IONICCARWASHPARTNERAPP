import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPreOrdersPage } from './dealer-pre-orders';

@NgModule({
  declarations: [
    DealerPreOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPreOrdersPage),
  ],
})
export class DealerPreOrdersPageModule {}
