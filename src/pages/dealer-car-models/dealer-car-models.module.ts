import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCarModelsPage } from './dealer-car-models';

@NgModule({
  declarations: [
    DealerCarModelsPage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCarModelsPage),
  ],
})
export class DealerCarModelsPageModule {}
