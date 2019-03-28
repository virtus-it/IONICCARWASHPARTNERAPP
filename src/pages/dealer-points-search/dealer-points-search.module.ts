import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPointsSearchPage } from './dealer-points-search';

@NgModule({
  declarations: [
    DealerPointsSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPointsSearchPage),
  ],
})
export class DealerPointsSearchPageModule {}
