import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutDashPage } from './checkout-dash.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutDashPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutDashPageRoutingModule {}
