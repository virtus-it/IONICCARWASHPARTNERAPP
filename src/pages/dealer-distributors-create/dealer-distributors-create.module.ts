import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDistributorsCreatePage } from './dealer-distributors-create';

@NgModule({
  declarations: [
    DealerDistributorsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDistributorsCreatePage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DealerDistributorsCreatePageModule {}
