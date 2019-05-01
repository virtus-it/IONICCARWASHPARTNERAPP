import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerPackageCreatePage } from './dealer-package-create';

@NgModule({
  declarations: [
    DealerPackageCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerPackageCreatePage),
  ],
})
export class DealerPackageCreatePageModule {}
