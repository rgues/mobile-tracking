import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavePackageSeaPageRoutingModule } from './save-package-sea-routing.module';

import { SavePackageSeaPage } from './save-package-sea.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    SavePackageSeaPageRoutingModule
  ],
  declarations: [SavePackageSeaPage]
})
export class SavePackageSeaPageModule {}
