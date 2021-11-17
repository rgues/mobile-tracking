import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SavePackagePageRoutingModule } from './save-package-routing.module';

import { SavePackagePage } from './save-package.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    SavePackagePageRoutingModule
  ],
  declarations: [SavePackagePage]
})
export class SavePackagePageModule {}
