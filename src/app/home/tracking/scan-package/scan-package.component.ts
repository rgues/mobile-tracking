
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ErrorService } from 'src/app/shared/service/error.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { Package } from '../models/package';
import { TrackingErrorService } from '../services/tracking-error.service';
import { TrackingService } from '../services/tracking.service';

@Component({
  selector: 'app-scan-package',
  templateUrl: './scan-package.component.html',
  styleUrls: ['./scan-package.component.scss'],
})
export class ScanPackageComponent implements OnInit {

  package: Package;
  organisation: any;
  canResend: boolean;

  constructor(
    private navparams: NavParams,
    private trackingService: TrackingService,
    private localStorage: LocalStorageService,
    private ui: UiService,
    private trackingError: TrackingErrorService,
    private translate: TranslateService,
    private router: Router,
    private error: ErrorService,
    private modal: ModalController
  ) {
       this.package = this.navparams.get('data');
       this.organisation = this.localStorage.getItemSecure('organisation-data');
       this.canResend = false;
  }

  ngOnInit() {}


  // cancel le modal
  cancelModal() {
      this.modal.dismiss();
  }

  backToScan() {
    this.cancelModal();
    this.router.navigate(['home/scan-dash']);
  }


  // send a sms to update the code
  sendSMS(packageData: Package) {

      this.translate.get('SENDING_TEXT').subscribe(trans => {
        this.ui.presentLoading(`${trans}...`);
      });

      this.trackingService.updatePackageStatut(packageData.PACKAGE_CODE).subscribe(reponse => {

        if (reponse && reponse.message === 'success') {
            // show the success message
            this.translate.get(['SMS_NOTIFY_MSG']).subscribe(trans => {
              this.ui.presentAlert('', trans.SMS_NOTIFY_MSG);
            });
            this.ui.dismissLoading();
            this.backToScan();
        } else {
            this.ui.dismissLoading();
        }
      }, error => {
        this.ui.dismissLoading();
        if(error && error.status === 0) {
            this.error.manageError(error);
        } else if (error&& error.error&& error.error.this_package_is_already_arrived) {
          this.canResend = true;
        } else if (error.error.user_not_found) {
          this.error.renewSession().then((data: any) => {
            if (data && data.result === 'OK') {
              this.sendSMS(packageData);
            } else {
              this.ui.dismissLoading();
            }
          });
        } else {
          this.ui.dismissLoading();
          this.trackingError.manageTrackingError(error);
        }

      })
  }


    // resend a sms to update the code
    resendSMS(packageData: Package) {

      this.translate.get('SENDING_TEXT').subscribe(trans => {
        this.ui.presentLoading(`${trans}...`);
      });

      this.trackingService.resendSMSPackage(packageData.PACKAGE_CODE).subscribe(reponse => {

        if (reponse && reponse.message === 'success') {
            // show the success message
            this.translate.get(['SMS_NOTIFY_MSG']).subscribe(trans => {
              this.ui.presentAlert('', trans.SMS_NOTIFY_MSG);
            });
            this.ui.dismissLoading();
            this.backToScan();
        } else {
            this.ui.dismissLoading();
        }

      }, error => {
        this.ui.dismissLoading();


        if(error && error.status === 0) {
            this.error.manageError(error);
        } else if (error.error.user_not_found) {
            this.error.renewSession().then((data: any) => {
              if (data && data.result === 'OK') {
                this.resendSMS(packageData);
              } else {
                this.ui.dismissLoading();

              }
            });
          } else {
            this.ui.dismissLoading();
            this.trackingError.manageTrackingError(error);
          }

      });
  }

}
