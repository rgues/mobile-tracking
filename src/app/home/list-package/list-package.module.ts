import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPackagePageRoutingModule } from './list-package-routing.module';

import { ListPackagePage } from './list-package.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    ListPackagePageRoutingModule
  ],
  declarations: [ListPackagePage]
})
export class ListPackagePageModule {}
