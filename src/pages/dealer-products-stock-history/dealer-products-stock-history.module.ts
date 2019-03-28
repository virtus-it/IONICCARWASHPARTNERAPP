import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerProductsStockHistoryPage } from './dealer-products-stock-history';

@NgModule({
  declarations: [
    DealerProductsStockHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerProductsStockHistoryPage),
  ],
})
export class DealerProductsStockHistoryPageModule {}
