import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCategoryHomePage } from './dealer-category-home';

@NgModule({
  declarations: [
    DealerCategoryHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCategoryHomePage),
  ],
})
export class DealerCategoryHomePageModule {}
