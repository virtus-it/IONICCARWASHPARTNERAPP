import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDistributorsPage } from './dealer-distributors';

@NgModule({
  declarations: [
    DealerDistributorsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDistributorsPage),
  ],
})
export class DealerDistributorsPageModule {}
