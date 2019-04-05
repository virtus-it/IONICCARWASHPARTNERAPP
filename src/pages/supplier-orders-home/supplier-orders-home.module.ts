import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersHomePage } from './supplier-orders-home';

@NgModule({
  declarations: [
    SupplierOrdersHomePage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierOrdersHomePage),
  ],
})
export class SupplierOrdersHomePageModule {}
