import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { TrackingErrorService } from 'src/app/home/tracking/services/tracking-error.service';
import { TrackingService } from 'src/app/home/tracking/services/tracking.service';
import { ConstantService } from '../service/constant.service';
import { ErrorService } from '../service/error.service';
import { FormUtilsService } from '../service/form-utils.service';
import { UtilService } from '../service/util.service';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss'],
})
export class ListCustomerComponent implements OnInit {
  loading: boolean;
  filterData: any[];
  customers: any[];
  filter: boolean;
  allData: any[];
  nbItems: number;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;

  constructor(
    private trackingService: TrackingService,
    private trakingError: TrackingErrorService,
    private formUtil: FormUtilsService,
    private error: ErrorService,
    private util: UtilService,
    private modal: ModalController
  ) {
    this.filterData = [];
    this.customers = [];
    this.loading = false;
    this.filter = false;
    this.allData = [];
    this.nbItems = 15;
  }

  ngOnInit() {
    this.loading = true;
    this.getCustomers(null);
  }

  // Filter a customers
  searchForInvitation(ev: any) {
    this.infiniteScroll.disabled = false;
    this.filter = true;
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.allData = this.filterData.filter((customer) => {
        if (customer) {
          return customer.CLIENT_FIRST_NAME
            ? customer.CLIENT_FIRST_NAME.toLowerCase().indexOf(
                val.toLowerCase()
              ) > -1
            : customer.CLIENT_LAST_NAME.toLowerCase().indexOf(
                val.toLowerCase()
              ) > -1;
        }
      });
      if (this.allData.length > this.nbItems) {
        for (let i = 0; i < this.nbItems; i++) {
          this.customers.push(this.allData[this.customers.length]);
        }
      } else {
        this.customers = this.allData;
      }
    } else {
      this.customers = this.filterData;
    }
  }

  // Get all customers
  getCustomers(event) {
    this.trackingService.getAllCustomers().subscribe(
      (reponse: any) => {
        if (reponse && reponse.clients.length > 0) {
          const customers = this.util.orderByKeyDown(
            reponse.clients,
            'CLIENT_FIRST_NAME'
          );
          this.allData = customers;
          this.filterData = this.allData;
          if (this.allData.length > this.nbItems) {
            for (let i = 0; i < this.nbItems; i++) {
              this.customers.push(this.allData[this.customers.length]);
            }
          } else {
            this.customers = this.allData;
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

      // view the phone
      viewPhone(phone: string, prefix: string) {
        return this.formUtil.formatPhoneNumber(phone,prefix);
      }

  // Refresh the list
  refreSher(event) {
    this.infiniteScroll.disabled = false;
    this.getCustomers(event);
  }

  // Infinite scroll data
  infinteScrollData(event) {
    setTimeout(() => {
      for (let i = 0; i < this.nbItems; i++) {
        if (this.customers.length < this.allData.length) {
          this.customers.push(this.allData[this.customers.length]);
        } else if (this.customers.length === this.allData.length) {
          event.target.disabled = true;
        }
      }
      event.target.complete();
    }, 2000);
  }

  // select a customers
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
}
