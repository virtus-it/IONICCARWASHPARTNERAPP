import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCustomersCreatePage } from './dealer-customers-create';

@NgModule({
  declarations: [
    DealerCustomersCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCustomersCreatePage),
  ],
})
export class DealerCustomersCreatePageModule {}
