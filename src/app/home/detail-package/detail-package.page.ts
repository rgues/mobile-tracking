import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/shared/service/constant.service';
import { DateserviceService } from 'src/app/shared/service/dateservice.service';
import { ErrorService } from 'src/app/shared/service/error.service';;
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { PluginsService } from 'src/app/shared/service/plugin.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { TrackingService } from '../tracking/services/tracking.service';

@Component({
  selector: 'app-detail-package',
  templateUrl: './detail-package.page.html',
  styleUrls: ['./detail-package.page.scss'],
})
export class DetailPackagePage implements OnInit {
  packageData: any;
  organisation: any;
  amount: any;
  qrcode: string;
  loadingType: boolean;
  agenciesList: any;
  currentDate: string;
  printerActive:boolean;

  constructor(
    private trackingService: TrackingService,
    private dateService: DateserviceService,
    private translate: TranslateService,
    private ui: UiService,
    private plugin: PluginsService,
    private errorService: ErrorService,
    private localStorage: LocalStorageService
  ) {
    this.packageData = this.trackingService.getData();
    console.log(this.packageData);

    let amount = {
      total: this.packageData.payment_total.PAYMENT_TOTAL
        ? parseFloat(this.packageData.payment_total.PAYMENT_TOTAL)
        : 0,
      amountPay: this.packageData.detail_payment.PAYMENT_MONTANT
        ? parseFloat(this.packageData.detail_payment.PAYMENT_MONTANT)
        : 0,
      restToPay: 0,
    };
    amount.restToPay = amount.total - amount.amountPay;
    this.amount = amount;
    this.organisation = this.localStorage.getItemSecure('organisation-data');

    this.qrcode = this.trackingService.getQrCode(
      this.packageData.infos_package
    );

    this.agenciesList = [];
    this.currentDate = this.dateService.formatDateTiret(new Date());
    this.printerActive = true;
  }

  ngOnInit() {
    this.getListOfAgencies();
  }

  // format the date
  formatDate(date: string) {
     return this.dateService.formatDateTiret(date);
  }

  // Get the list of shipping type
  getListOfAgencies(event?: any) {
    this.trackingService.getAgencies().subscribe(
      (reponse: any) => {
        if (reponse && reponse.message === 'success') {
          if (reponse.agences && reponse.agences.length > 0) {
            this.agenciesList = reponse.agences;
          }
        }
        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        if (event) {
          event.target.complete();
        }
        this.errorService.manageError(error);
      }
    );
  }

  // get the name of agency
  getAgencyName(destinationId: any) {
    let agency = '';
    if (this.agenciesList && this.agenciesList.length > 0) {
      this.agenciesList.forEach((data) => {
        if (parseInt(destinationId) === parseInt(data.CITY_ID)) {
          agency = data.AGENCE_NAME;
        }
      });
    }
    return agency;
  }

  refreSher(event) {
    this.getListOfAgencies(event);
  }

  // get the logo
  getLogo(url: string) {
    return `${ConstantService.baseUrlApi}${url}`;
  }

  // get the status name
  getStatusName(dataStatus: any) {
    if (dataStatus && dataStatus[dataStatus.length -1] && dataStatus[dataStatus.length -1].STATUS_LABEL) {
      return  dataStatus[dataStatus.length -1].STATUS_LABEL;
    } else {
      return  '';
    }
  }

  // print a package
  printPackage() {
    this.printerActive = false;
    this.plugin.screenShootSave().subscribe(trans => {

      setTimeout(() => {
        this.printerActive = true;
      }, 300);

    });
  }

  // print a package
  printPackageOnPrinter() {
    this.printerActive = false;
    this.plugin.screenShootHTML().subscribe((data) => {
      if (data) {
        // launch the printer
        this.plugin.printDocument(data).subscribe(reponse => {
          setTimeout(() => {
            this.printerActive = true;
          }, 300);
        });
      } else {
        setTimeout(() => {
          this.printerActive = true;
        }, 300);
        this.translate.get('PRINT_ERROR').subscribe((trans) => {
          this.ui.presentAlert('', trans);
        });
      }
    });
  }
}
