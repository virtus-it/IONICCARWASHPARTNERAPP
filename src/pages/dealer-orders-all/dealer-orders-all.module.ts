import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersAllPage } from './dealer-orders-all';

@NgModule({
  declarations: [
    DealerOrdersAllPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerOrdersAllPage),
  ],
})
export class DealerOrdersAllPageModule {}
