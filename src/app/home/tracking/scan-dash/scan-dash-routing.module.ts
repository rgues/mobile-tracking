import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanDashPage } from './scan-dash.page';

const routes: Routes = [
  {
    path: '',
    component: ScanDashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanDashPageRoutingModule {}
