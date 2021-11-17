import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerListingPage } from './customer-listing.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerListingPageRoutingModule {}
