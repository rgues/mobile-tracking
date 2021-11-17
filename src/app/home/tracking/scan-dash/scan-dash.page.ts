import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PluginsService } from 'src/app/shared/service/plugin.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { ScanPackageComponent } from '../scan-package/scan-package.component';

@Component({
  selector: 'app-scan-dash',
  templateUrl: './scan-dash.page.html',
  styleUrls: ['./scan-dash.page.scss'],
})
export class ScanDashPage {

  scannerOn: boolean;
  constructor(
    private modatCtrl: ModalController,
    private translate: TranslateService,
    private ui: UiService,
    private plugin: PluginsService
  ) {
      this.scannerOn = false;
  }

  // open the qr code scanner
  openScannerQrCode() {

    this.scannerOn = PluginsService.scannerOn;

    this.plugin.scanQrCode().subscribe((reponse: any) => {

      this.scannerOn = PluginsService.scannerOn;

      switch(reponse.result) {

        case 'success' :
            this.scannerOn = false;
            this.showPackageInfo(JSON.parse(reponse.data));
            break;

        case 'denied':
            // show the permission message
            this.scannerOn = false;
            this.translate.get(['PERMISION_ERROR_MSG']).subscribe(trans => {
              this.ui.presentAlert('',trans.PERMISION_ERROR_MSG);
            });
          break;

        case 'error':
            // show the error message
            this.scannerOn = false;
           //this.showPackageInfo(reponse.data);
             this.translate.get(['SCAN_ERROR_MSG']).subscribe(trans => {
                this.ui.presentAlert('',trans.SCAN_ERROR_MSG);
            });
          break;

        default:
          break;

      }

    });
  }

  // Show the package information
  showPackageInfo(pakageInfo: any) {
    this.modatCtrl
      .create({
        component: ScanPackageComponent,
        componentProps: {
          data: pakageInfo,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then(() => {});
      });
  }

  ionViewDidLeave() {
    this.plugin.hideQRcode();
  }
}
