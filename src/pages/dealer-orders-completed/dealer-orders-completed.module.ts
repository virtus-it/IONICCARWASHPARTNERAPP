import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersCompletedPage } from './dealer-orders-completed';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DealerOrdersCompletedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerOrdersCompletedPage),
  ],
})
export class DealerOrdersCompletedPageModule {}
