import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerSupplierCreatePage } from './dealer-supplier-create';

@NgModule({
  declarations: [
    DealerSupplierCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerSupplierCreatePage),
  ],
})
export class DealerSupplierCreatePageModule {}
