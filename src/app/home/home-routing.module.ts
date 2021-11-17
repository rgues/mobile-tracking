import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ShowPackageSaveComponent } from './show-package-save/show-package-save.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'scan-dash',
    loadChildren: () => import('./tracking/scan-dash/scan-dash.module').then( m => m.ScanDashPageModule)
  },
  {
    path: 'checkout-dash',
    loadChildren: () => import('./tracking/checkout-dash/checkout-dash.module').then( m => m.CheckoutDashPageModule)
  },
  {
    path: 'save-package-air',
    loadChildren: () => import('./save-package/save-package.module').then( m => m.SavePackagePageModule)
  },
  {
    path: 'save-package-sea',
    loadChildren: () => import('./save-package-sea/save-package-sea.module').then( m => m.SavePackageSeaPageModule)
  },
  {
    path: 'list-package',
    loadChildren: () => import('./list-package/list-package.module').then( m => m.ListPackagePageModule)
  },
  {
    path: 'detail-package',
    loadChildren: () => import('./detail-package/detail-package.module').then( m => m.DetailPackagePageModule)
  },
  {
    path: 'show-package',
    component : ShowPackageSaveComponent
  },
  {
    path: 'customer-listing',
    loadChildren: () => import('./customer-listing/customer-listing.module').then( m => m.CustomerListingPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
