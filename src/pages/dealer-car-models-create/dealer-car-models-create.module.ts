import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerCarModelsCreatePage } from './dealer-car-models-create';

@NgModule({
  declarations: [
    DealerCarModelsCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerCarModelsCreatePage),
  ],
})
export class DealerCarModelsCreatePageModule {}
