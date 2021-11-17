import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {  ModalController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from '../shared/service/constant.service';
import { ErrorService } from '../shared/service/error.service';
import { LocalStorageService } from '../shared/service/local-storage.service';
import { UiService } from '../shared/service/ui.service';
import { TrackPackageComponent } from './track-package/track-package.component';
import { TrackingErrorService } from './tracking/services/tracking-error.service';
import { TrackingService } from './tracking/services/tracking.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  organisation: any;
  trackCode: string;
  showImage:boolean;

  constructor(
    private localStorage: LocalStorageService,
    private modatCtrl: ModalController,
    private platform: Platform,
    private trackingService: TrackingService,
    private trackingError: TrackingErrorService,
    private error: ErrorService,
    private translate: TranslateService,
    private router: Router,
    private ui: UiService
  ) {
    this.organisation = this.localStorage.getItemSecure('organisation-data');
    this.trackCode = '';
    this.showImage = true;
    this.platform.keyboardDidHide.subscribe(() => {
        this.showImage = true;
    });
    this.trackingService.generateTracking();

  }

  ionicViewWillEnter() {
    this.showImage = true;
  }


  // get the logo
  getLogo(url: string) {
    return `${ConstantService.baseUrlApiDev}${url}`;
  }

  gotoTrack() {
    this.router.navigate(['home', 'scan-dash']);
  }

  hidePicture() {
      if (this.trackCode) {
        this.showImage = false;
      } else {
        this.showImage = true;
      }
  }

  // Show the package information
  showPackageInfo(pakageInfo: any, amount ?: any,statut?: string) {
    this.modatCtrl
      .create({
        component: TrackPackageComponent,
        componentProps: {
          data: pakageInfo,
          amount : amount,
          statut: statut
        },
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then(() => {});
      });
  }

  // send a sms to update the code
  trackingPackage(packageData: string) {
    this.translate.get('TRACKING_TEXT').subscribe((trans) => {
      this.ui.presentLoading(`${trans}...`);
    });

    this.trackingService.getPackageData(packageData).subscribe(
      (reponse) => {
        if (reponse && reponse.message === 'success') {
          // show the success message
          this.ui.dismissLoading();
          const packageData = reponse.package_information;
          const statut = reponse.status_package ? reponse.status_package.STATUS_LABEL : '';
          let amount = {
            total : reponse.payment_total.PAYMENT_TOTAL ? parseFloat(reponse.payment_total.PAYMENT_TOTAL)  : 0,
            amountPay: reponse.amount_paid ? parseFloat(reponse.amount_paid)  : 0,
            restToPay: 0
          };
          amount.restToPay = amount.total - amount.amountPay;
          this.trackCode = '';
          this.showPackageInfo(packageData,amount,statut);
        } else {
          this.trackCode = '';
          this.ui.dismissLoading();
        }
      },
      (error) => {
        this.ui.dismissLoading();
        this.trackCode = '';
        if (error && error.status === 0) {
          this.error.manageError(error);
        } else {
          this.trackingError.manageTrackingError(error);
        }
      }
    );
  }

  // check the package code
  checkCodePackage() {
    if (this.trackCode) {
      this.trackingPackage(this.trackCode);
    } else {
      this.translate.get(['TRACK_MESSAGE']).subscribe((trans) => {
        this.ui.presentAlert('', trans.TRACK_MESSAGE);
      });
    }
  }

  checkPackage() {
    this.router.navigate(['home', 'customer-listing']);
  }



}
