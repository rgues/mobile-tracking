import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerListingPageRoutingModule } from './customer-listing-routing.module';

import { CustomerListingPage } from './customer-listing.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    CustomerListingPageRoutingModule
  ],
  declarations: [CustomerListingPage]
})
export class CustomerListingPageModule {}
