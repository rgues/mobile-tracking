import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutDashPageRoutingModule } from './checkout-dash-routing.module';

import { CheckoutDashPage } from './checkout-dash.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckoutResultPage } from '../checkout-result/checkout-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    CheckoutDashPageRoutingModule
  ],
  declarations: [
    CheckoutDashPage,
    CheckoutResultPage
  ],entryComponents :[
    CheckoutResultPage
  ]
})
export class CheckoutDashPageModule {}
