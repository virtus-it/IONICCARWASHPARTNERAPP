import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPointsPage } from './dealer-points';

@NgModule({
  declarations: [
    DealerPointsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPointsPage),
  ],
})
export class DealerPointsPageModule {}
