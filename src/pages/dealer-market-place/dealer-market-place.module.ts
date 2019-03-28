import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerMarketPlacePage } from './dealer-market-place';

@NgModule({
  declarations: [
    DealerMarketPlacePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerMarketPlacePage),
  ],
})
export class DealerMarketPlacePageModule {}
