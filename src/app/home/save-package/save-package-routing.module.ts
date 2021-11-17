import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavePackagePage } from './save-package.page';

const routes: Routes = [
  {
    path: '',
    component: SavePackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavePackagePageRoutingModule {}
