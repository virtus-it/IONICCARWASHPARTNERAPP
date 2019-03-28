import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerProductsCreatePage } from './dealer-products-create';

@NgModule({
  declarations: [
    DealerProductsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerProductsCreatePage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DealerProductsCreatePageModule {}
