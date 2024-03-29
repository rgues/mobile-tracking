import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPackagePageRoutingModule } from './detail-package-routing.module';

import { DetailPackagePage } from './detail-package.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    DetailPackagePageRoutingModule
  ],
  declarations: [DetailPackagePage]
})
export class DetailPackagePageModule {}
