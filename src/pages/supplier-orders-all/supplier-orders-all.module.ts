import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersAllPage } from './supplier-orders-all';

@NgModule({
  declarations: [
    SupplierOrdersAllPage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierOrdersAllPage),
  ],
})
export class SupplierOrdersAllPageModule {}
