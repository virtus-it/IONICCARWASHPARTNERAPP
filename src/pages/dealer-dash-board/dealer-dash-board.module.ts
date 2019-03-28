import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerDashBoardPage } from './dealer-dash-board';

@NgModule({
  declarations: [
    DealerDashBoardPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerDashBoardPage),
  ],
})
export class DealerDashBoardPageModule {}
