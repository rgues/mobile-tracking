import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPackagePage } from './list-package.page';

const routes: Routes = [
  {
    path: '',
    component: ListPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPackagePageRoutingModule {}
