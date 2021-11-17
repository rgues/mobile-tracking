import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavePackageSeaPage } from './save-package-sea.page';

const routes: Routes = [
  {
    path: '',
    component: SavePackageSeaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavePackageSeaPageRoutingModule {}
