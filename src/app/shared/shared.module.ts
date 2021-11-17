import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PluginsService } from './service/plugin.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConstantService } from './service/constant.service';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { PrefixComponent } from './prefix/prefix.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';



@NgModule({
  declarations: [
    ListCustomerComponent,
    PrefixComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    NgxQRCodeModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    TranslateModule,
    NgxQRCodeModule,
    ReactiveFormsModule,
    FormsModule,
    ListCustomerComponent,
    PrefixComponent
  ],
  providers:[
    PluginsService,
    ConstantService,
    TranslateService
  ],
  entryComponents:[
    ListCustomerComponent,
    PrefixComponent
  ]
})
export class SharedModule { }
