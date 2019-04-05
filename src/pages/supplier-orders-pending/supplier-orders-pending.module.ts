import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersPendingPage } from './supplier-orders-pending';

@NgModule({
  declarations: [
    SupplierOrdersPendingPage,
  ],
  imports: [
    IonicPageModule.forChild(SupplierOrdersPendingPage),
  ],
})
export class SupplierOrdersPendingPageModule {}
