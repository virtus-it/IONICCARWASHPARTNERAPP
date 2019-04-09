import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerUsersCustomercareCreatePage } from './dealer-users-customercare-create';

@NgModule({
  declarations: [
    DealerUsersCustomercareCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerUsersCustomercareCreatePage),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class DealerUsersCustomercareCreatePageModule {}
