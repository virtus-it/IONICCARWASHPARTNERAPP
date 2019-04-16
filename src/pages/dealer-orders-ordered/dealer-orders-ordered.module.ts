import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerOrdersOrderedPage } from './dealer-orders-ordered';
import {PipesModule} from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    DealerOrdersOrderedPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(DealerOrdersOrderedPage),
  ],
})
export class DealerOrdersOrderedPageModule {}
