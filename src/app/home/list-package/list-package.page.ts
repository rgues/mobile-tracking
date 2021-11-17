import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { ConstantService } from 'src/app/shared/service/constant.service';
import { ErrorService } from 'src/app/shared/service/error.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { UtilService } from 'src/app/shared/service/util.service';
import { TrackingErrorService } from '../tracking/services/tracking-error.service';
import { TrackingService } from '../tracking/services/tracking.service';

@Component({
  selector: 'app-list-package',
  templateUrl: './list-package.page.html',
  styleUrls: ['./list-package.page.scss'],
})
export class ListPackagePage implements OnInit {
  loading: boolean;
  filterData: any[];
  packages: any[];
  filter: boolean;
  allData: any[];
  nbItems: number;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  organisation: any;

  constructor(
    private trackingService: TrackingService,
    private trakingError: TrackingErrorService,
    private router: Router,
    private localStorage: LocalStorageService,
    private error: ErrorService,
    private util: UtilService,
    private modal: ModalController
  ) {
    this.filterData = [];
    this.packages = [];
    this.loading = false;
    this.filter = false;
    this.allData = [];
    this.nbItems = 15;
    this.organisation = this.localStorage.getItemSecure('organisation-data');
  }

  ngOnInit() {
    this.loading = true;
    this.getPackages(null);
  }

  // Filter a packages
  searchForPackage(ev: any) {
    this.infiniteScroll.disabled = false;
    this.filter = true;
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.allData = this.filterData.filter((packageData) => {
        if (packageData) {
          return  packageData.infos_package.PACKAGE_CODE.toLowerCase().indexOf(val.toLowerCase()) > -1
        }
      });
      if (this.allData.length > this.nbItems) {
        for (let i = 0; i < this.nbItems; i++) {
          this.packages.push(this.allData[this.packages.length]);
        }
      } else {
        this.packages = this.allData;
      }
    } else {
      this.packages = this.filterData;
    }
  }

  // Get all packages
  getPackages(event) {
    this.trackingService.getAllPackages().subscribe(
      (reponse: any) => {
        if (reponse && reponse.liste_paquet.length > 0) {
          const packages = this.util.orderByObjetKeyUp(
            reponse.liste_paquet,
            'infos_package',
            'PACKAGE_ID'
          );
          this.allData = packages;
          this.filterData = this.allData;
          if (this.allData.length > this.nbItems) {
            for (let i = 0; i < this.nbItems; i++) {
              this.packages.push(this.allData[this.packages.length]);
            }
          } else {
            this.packages = this.allData;
          }
        }

        if (event) {
          setTimeout(() => {
            event.target.complete();
          }, 200);
        }
        this.loading = false;
      },
      (error) => {

        if (event) {
          setTimeout(() => {
            event.target.complete();
          }, 200);
        }
        this.loading = false;
        if (error && error.error && error.error.message === 'error') {
          this.trakingError.manageTrackingError(error);
        } else {
          this.error.manageError(error);
        }
      }
    );
  }

  // Refresh the list
  refreSher(event) {
    this.infiniteScroll.disabled = false;
    this.getPackages(event);
  }

  // Infinite scroll data
  infinteScrollData(event) {
    setTimeout(() => {
      for (let i = 0; i < this.nbItems; i++) {
        if (this.packages.length < this.allData.length) {
          this.packages.push(this.allData[this.packages.length]);
        } else if (this.packages.length === this.allData.length) {
          event.target.disabled = true;
        }
      }
      event.target.complete();
    }, 2000);
  }

  // select a packages
  selectCustomers(event) {
    this.modal.dismiss(event.detail.value, 'select');
  }

  // close modal
  closeModal() {
    this.modal.dismiss(null, 'cancel');
  }

  // get the logo
  getLogo(url: string) {
    return `${ConstantService.baseUrlApi}${url}`
 }

 // get the status name
 getStatusName(dataStatus: any) {
    return  dataStatus[dataStatus.length -1].STATUS_LABEL;
 }

 sendPackageData(packageData: any) {
  this.trackingService.sendData(packageData);
  this.router.navigate(['home','detail-package'])
 }

}
