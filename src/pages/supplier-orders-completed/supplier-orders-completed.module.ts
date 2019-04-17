import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupplierOrdersCompletedPage } from './supplier-orders-completed';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SupplierOrdersCompletedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SupplierOrdersCompletedPage),
  ],
})
export class SupplierOrdersCompletedPageModule {}
