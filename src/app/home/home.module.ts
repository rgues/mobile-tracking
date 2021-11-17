import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TrackPackageComponent } from './track-package/track-package.component';
import { ShowPackageSaveComponent } from './show-package-save/show-package-save.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage,
    TrackPackageComponent,
    ShowPackageSaveComponent
  ],
  entryComponents: [
    TrackPackageComponent,
    ShowPackageSaveComponent
  ],
})
export class HomePageModule {}
