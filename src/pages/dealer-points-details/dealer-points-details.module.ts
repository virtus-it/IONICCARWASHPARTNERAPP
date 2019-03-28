import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPointsDetailsPage } from './dealer-points-details';

@NgModule({
  declarations: [
    DealerPointsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPointsDetailsPage),
  ],
})
export class DealerPointsDetailsPageModule {}
