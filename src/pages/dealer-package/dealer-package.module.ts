import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPackagePage } from './dealer-package';

@NgModule({
  declarations: [
    DealerPackagePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPackagePage),
  ],
})
export class DealerPackagePageModule {}
