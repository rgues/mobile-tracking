import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { ListCustomerComponent } from 'src/app/shared/list-customer/list-customer.component';
import { ErrorService } from 'src/app/shared/service/error.service';
import { FormUtilsService } from 'src/app/shared/service/form-utils.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { UtilService } from 'src/app/shared/service/util.service';
import { TrackingErrorService } from '../tracking/services/tracking-error.service';
import { TrackingService } from '../tracking/services/tracking.service';

@Component({
  selector: 'app-customer-listing',
  templateUrl: './customer-listing.page.html',
  styleUrls: ['./customer-listing.page.scss'],
})
export class CustomerListingPage implements OnInit {
  phone: string;
  loading: boolean;
  filterData: any[];
  packages: any[];
  filter: boolean;
  allData: any[];
  nbItems: number;
  @ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
  organisation: any;
  totalWeight:any;
  totalAmountPaid:any;
  balance:any;
  totalDiscount:any;
  totalRestToPay:any;

  constructor(
    private trackingService: TrackingService,
    private trakingError: TrackingErrorService,
    private localStorage: LocalStorageService,
    private modatCtrl: ModalController,
    private formUtil: FormUtilsService,
    private error: ErrorService,
    private util: UtilService
  ) {
    this.phone = '';
    this.packages = [];
    this.filterData = [];
    this.nbItems = 10;
    this.loading = false;
    this.organisation = this.localStorage.getItemSecure('organisation-data');

    this.totalWeight = 0;
    this.totalAmountPaid = 0;
    this.balance = 0;
    this.totalDiscount = 0;
    this.totalRestToPay = 0;
  }

  ngOnInit() {}

  // Get the result of the research
  getCustomer() {

    this.loading = true;
    if (this.formUtil.validatePhone(this.formUtil.formatPhone(this.phone))) {
      this.getPackages();
    } else {
      this.loading = false;
    }
  }

  // get the balance
  getBalance(total:any, discount: any) {
      return parseFloat(total) - parseFloat(discount);
  }

    // view the phone
    viewPhone(phone: string, prefix: string) {
      return this.formUtil.formatPhoneNumber(phone,prefix);
    }

  // Get all packages
  getPackages() {
    this.trackingService.getCustomersReport(this.phone).subscribe(
      (reponse: any) => {
        if (reponse && reponse.liste_package.length > 0) {
          const packages = this.util.orderByObjetKeyUp(
            reponse.liste_package,
            'infos_package',
            'PACKAGE_ID'
          );

          this.totalWeight = parseFloat(reponse.total_weight).toFixed(2);
          this.totalAmountPaid = reponse.total_amount_paid;
          this.balance = reponse.total;
          this.totalDiscount = reponse.remise;
          this.totalRestToPay = reponse.rest_to_pay;

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
        this.loading = false;
      },
      (error) => {

        if (error && error.error && error.error.message === 'error') {
          if (error && error.error && error.error.user_not_found) {
            this.error.renewSession().then((data: any) => {
              if (data && data.result === 'OK') {
                this.getPackages();
              } else {
                this.loading = false;
              }
            });
          } else {
            this.loading = false;
            this.trakingError.manageTrackingError(error);
          }
        } else {
          this.loading = false;
          this.error.manageError(error);
        }
      }
    );
  }

    // find custo;er
    findCustomers() {
      this.modatCtrl
        .create({
          component: ListCustomerComponent,
        })
        .then((modalEl) => {
          modalEl.present();
          modalEl.onDidDismiss().then((ans) => {
            if (ans && ans.role === 'select') {
              if (ans.data && ans.data.CLIENT_TEL) {
                // ans.data.CLIENT_PREFIX  ans.data.CLIENT_TEL
                this.phone = ans.data.CLIENT_TEL;
                this.getCustomer();
              }
            }
          });
        });
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

}
