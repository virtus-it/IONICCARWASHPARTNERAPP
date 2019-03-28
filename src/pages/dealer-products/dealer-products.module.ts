import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerProductsPage } from './dealer-products';

@NgModule({
  declarations: [
    DealerProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerProductsPage),
  ],
})
export class DealerProductsPageModule {}
