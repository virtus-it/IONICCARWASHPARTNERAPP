import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCustomersPage } from './dealer-customers';

@NgModule({
  declarations: [
    DealerCustomersPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCustomersPage),
  ],
})
export class DealerCustomersPageModule {}
