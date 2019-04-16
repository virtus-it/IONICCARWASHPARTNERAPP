import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersPendingPage } from './supplier-orders-pending';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SupplierOrdersPendingPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SupplierOrdersPendingPage),
  ],
})
export class SupplierOrdersPendingPageModule {}
