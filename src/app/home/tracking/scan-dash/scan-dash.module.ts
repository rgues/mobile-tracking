import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanDashPageRoutingModule } from './scan-dash-routing.module';

import { ScanDashPage } from './scan-dash.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScanPackageComponent } from '../scan-package/scan-package.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    ScanDashPageRoutingModule
  ],
  declarations: [
    ScanDashPage,
    ScanPackageComponent
  ],entryComponents:[
    ScanPackageComponent
  ]
})
export class ScanDashPageModule {}
