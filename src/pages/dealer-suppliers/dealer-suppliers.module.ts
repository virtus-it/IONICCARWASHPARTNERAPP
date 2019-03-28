import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerSuppliersPage } from './dealer-suppliers';

@NgModule({
  declarations: [
    DealerSuppliersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerSuppliersPage),
  ],
})
export class DealerSuppliersPageModule {}
