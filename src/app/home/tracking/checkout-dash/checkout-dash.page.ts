import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from 'src/app/shared/service/error.service';
import { PluginsService } from 'src/app/shared/service/plugin.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { CheckoutResultPage } from '../checkout-result/checkout-result.page';
import { Package } from '../models/package';
import { TrackingErrorService } from '../services/tracking-error.service';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-checkout-dash',
  templateUrl: './checkout-dash.page.html',
  styleUrls: ['./checkout-dash.page.scss'],
})
export class CheckoutDashPage implements OnInit {
  scannerOn: boolean;
  constructor(
    private modatCtrl: ModalController,
    private ui: UiService,
    private plugin: PluginsService,
    private translate: TranslateService,
    private trackingService: TrackingService,
    private trackingError: TrackingErrorService,
    private error: ErrorService,
  ) {
      this.scannerOn = false;
  }


  ngOnInit() {
  }


  // open the qr code scanner
  openScannerQrCode() {

    this.scannerOn = PluginsService.scannerOn;

    this.plugin.scanQrCode().subscribe((reponse: any) => {

      this.scannerOn = PluginsService.scannerOn;

      switch(reponse.result) {

        case 'success' :
            this.checkoutPackage(JSON.parse(reponse.data));
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
         //  this.checkoutPackage(reponse.data);
           this.translate.get(['SCAN_ERROR_MSG']).subscribe(trans => {
            this.ui.presentAlert('',trans.SCAN_ERROR_MSG);
          });

          break;

        default:
          break;

      }

    });
  }

  // Show the checkout response
  showCheckoutResponse(answerData: any) {
    this.modatCtrl
      .create({
        component: CheckoutResultPage,
        componentProps: {
          data: answerData,
        },
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then(() => {});
      });
  }


    // checkout the package
    checkoutPackage(packageData: Package) {

      this.translate.get('CHECKING_TEXT').subscribe(trans => {
        this.ui.presentLoading(`${trans}...`);
      });

      const param = {
        package_code : packageData.PACKAGE_CODE
      };

      this.trackingService.checkoutPackage(param).subscribe(reponse => {

        if (reponse && reponse.message === 'success') {
            // show the result
            this.scannerOn = false;
            this.ui.dismissLoading();
            this.translate.get(['PACKAGE_CHECKOUT_SUCCEED']).subscribe( trans => {
              const checkoutResponse = {
                status : true,
                message : trans.PACKAGE_CHECKOUT_SUCCEED
              }
              this.showCheckoutResponse(checkoutResponse);
            });
        } else {
          this.scannerOn = false;
          this.ui.dismissLoading();
        }

      }, error => {


        if(error && error.error && error.error.message === 'error') {
          if (error.error.this_package_is_not_already_arrived_to_destination) {

            this.translate.get(['PACKAGE_IS_NOT_ATTEND_DESTINATION']).subscribe( trans => {
              const checkoutResponse = {
                status : false,
                message : trans.PACKAGE_IS_NOT_ATTEND_DESTINATION
              }
              this.showCheckoutResponse(checkoutResponse);
            });
            this.ui.dismissLoading();
            this.scannerOn = false;

          } else if (error.error.this_package_is_already_checkout) {

            this.translate.get(['PACKAGE_ALREADY_CHECKOUT']).subscribe( trans => {
              const checkoutResponse = {
                status : false,
                message : trans.PACKAGE_ALREADY_CHECKOUT
              }
              this.showCheckoutResponse(checkoutResponse);
            });
            this.ui.dismissLoading();
            this.scannerOn = false;
          } else if (error.error.user_not_found) {
            this.error.renewSession().then((data: any) => {
              if (data && data.result === 'OK') {
                this.checkoutPackage(packageData);
              } else {
                this.ui.dismissLoading();
                this.scannerOn = false;
              }
            });
          } else {
            this.ui.dismissLoading();
            this.scannerOn = false;
            this.trackingError.manageTrackingError(error);
          }

        } else {
          this.ui.dismissLoading();
          this.scannerOn = false;
          this.error.manageError(error);
        }

      })
  }

  ionViewDidLeave() {
    this.plugin.hideQRcode();
  }

}
