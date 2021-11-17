import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, ModalController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ListCustomerComponent } from 'src/app/shared/list-customer/list-customer.component';
import { PrefixComponent } from 'src/app/shared/prefix/prefix.component';
import { DateserviceService } from 'src/app/shared/service/dateservice.service';
import { ErrorService } from 'src/app/shared/service/error.service';
import { EventService } from 'src/app/shared/service/events.service';
import { FormUtilsService } from 'src/app/shared/service/form-utils.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { LocationService } from 'src/app/shared/service/location.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { TrackingErrorService } from '../tracking/services/tracking-error.service';
import { TrackingService } from '../tracking/services/tracking.service';

interface Packages {
  tracking_number?: string;
  prefix_receiver_phone: string;
  receiver_phone: string;
  receiver_firstname_and_lastname: string;
  bag_number: string;
  weight: string;
  volume: string;
  reception_date?: string;
  shipping_type: string;
  amount_paid: string;
}

@Component({
  selector: 'app-save-package-sea',
  templateUrl: './save-package-sea.page.html',
  styleUrls: ['./save-package-sea.page.scss'],
})
export class SavePackageSeaPage implements OnInit {
  formData: FormGroup;
  validationMessages: any;
  errorPhone: boolean;
  loading: boolean;
  loadingType: boolean;
  packetList: Packages[];
  spinner: any;
  agenciesList: any[];
  customersList: any[];
  shippingList: any[];
  states: any[];
  currentDate:any;
  organisation: any;

  @ViewChild(IonContent) content: IonContent;

  constructor(
    private fb: FormBuilder,
    private tracking: TrackingService,
    private trackingError: TrackingErrorService,
    private nav: NavController,
    private zone: NgZone,
    private dateService: DateserviceService,
    private location: LocationService,
    private translate: TranslateService,
    private router: Router,
    private modatCtrl: ModalController,
    private formUtil: FormUtilsService,
    private errorService: ErrorService,
    private localStorage: LocalStorageService,
    private ui: UiService,
    private event: EventService
  ) {
    this.errorPhone = true;
    this.loading = false;
    this.loadingType = false;
    this.packetList = [];
    this.agenciesList = [];
    this.customersList = [];
    this.shippingList = [];
    this.states = [];
    this.currentDate = new Date();
    this.organisation = this.localStorage.getItemSecure('organisation-data');
  }

  ngOnInit() {
    this.initFormData();
    this.getValidationsMessage();
    this.getListOfShippingType();
    this.getWordCountries();
    this.getListOfAgencies();
  }

  // Form getters
  get agence_departure_id() {
    return this.formData.get('agence_departure_id');
  }

  get agence_destination_id() {
    return this.formData.get('agence_destination_id');
  }

  get customers() {
    return this.formData.get('customers') as FormArray;
  }

  get tracking_number() {
    return this.formData.get('tracking_number');
  }

  get prefix_receiver_phone() {
    return this.formData.get('prefix_receiver_phone');
  }

  get receiver_phone() {
    return this.formData.get('receiver_phone');
  }

  get receiver_firstname_and_lastname() {
    return this.formData.get('receiver_firstname_and_lastname');
  }

  get bag_number() {
    return this.formData.get('bag_number');
  }

  get weight() {
    return this.formData.get('weight');
  }

  get volume() {
    return this.formData.get('volume');
  }

  get reception_date() {
    return this.formData.get('reception_date');
  }

  get shipping_type() {
    return this.formData.get('reception_date');
  }

  get amount_paid() {
    return this.formData.get('reception_date');
  }

  // Init the form
  initFormData() {
    this.formData = this.fb.group({
      agence_departure_id: ['', Validators.required],
      agence_destination_id: ['', Validators.required],
      customers: new FormArray([]),
      paquet: [[]],
      tracking_number: [''],
      prefix_receiver_phone: [''],
      receiver_phone: ['6'],
      receiver_firstname_and_lastname: [''],
      bag_number: [''],
      weight: [''],
      volume: [''],
      reception_date: [this.dateService.formatDateTiret(new Date())],
      shipping_type: [''],
      amount_paid: ['0'],
    });
  }



  // can show package data
  canAddNewPackage() {
    return (this.formData.value.prefix_receiver_phone && this.formData.value.prefix_receiver_phone !== ' ') &&
      (this.formData.value.receiver_phone  && this.formData.value.receiver_phone !== ' ') &&
      (this.formData.value.receiver_firstname_and_lastname  && this.formData.value.receiver_firstname_and_lastname !== ' ') &&
      (this.formData.value.bag_number  && this.formData.value.bag_number !== ' ') &&
      (this.formData.value.weight  && this.formData.value.weight !== ' ') &&
      (this.formData.value.volume  && this.formData.value.volume !== ' ') &&
      (this.formData.value.shipping_type && this.formData.value.shipping_type !== ' ')
     && !this.errorPhone;
  }

  // Can save package
  canSavePackage() {
    return this.formData.valid && !this.loading && (this.packetList.length > 0 || this.canAddNewPackage());
  }

    // format the phone number
    formatPhone(prefix: string) {
      const phoneFormater = this.formUtil.formatPhoneNumber(this.formData.value.receiver_phone,prefix);
      if(this.formUtil.validatePhoneFormat(this.formData.value.receiver_phone,prefix)) {
          this.formData.controls['receiver_phone'].setErrors({pattern: false});
          this.formData.controls['receiver_phone'].updateValueAndValidity();
          this.errorPhone = false;
      } else  {
          this.formData.get('receiver_phone').setValue(phoneFormater);
          this.formData.controls['receiver_phone'].setErrors({pattern: true});
          this.errorPhone = true;
      }

    }

  // Get validations messages
  getValidationsMessage() {
    this.translate.get(['FILL_REQUIRED_TEXT','PHONE_ERROR_MESSAGE']).subscribe((trans) => {
      this.validationMessages = {
        agence_departure_id: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        agence_destination_id: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        tracking_number: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        prefix_receiver_phone: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        receiver_phone: [
          { type: 'pattern', message: trans.PHONE_ERROR_MESSAGE }
        ],
        receiver_firstname_and_lastname: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        bag_number: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        weight: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        volume: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        reception_date: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        shipping_type: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
        amount_paid: [
          { type: 'required', message: trans.FILL_REQUIRED_TEXT }
        ],
      };
    });
  }

  // Update the country
  updateCountryPrefix(currentCountry: any) {
    this.states.forEach((state) => {
      if (state.name === currentCountry) {
        this.formData
          .get('prefix_receiver_phone')
          .setValue(state.callingCodes[0]);
      }
    });
  }

  // Get all the word countries
  getWordCountries() {
    this.location.getAllcountriesData().subscribe((countries: any) => {
      if (countries && countries.length > 0) {
        this.states = countries;
        this.updateCountryPrefix('Cameroon');
      }
    });
  }

  // open the countries modal
  showPrefix() {
    this.modatCtrl
      .create({
        component: PrefixComponent,
      })
      .then((modalEl) => {
        modalEl.present();
        modalEl.onDidDismiss().then((ans) => {
          if (ans && ans.role === 'select') {
            this.states.forEach((state) => {
              if (state.name === ans.data) {
                this.formData
                  .get('prefix_receiver_phone')
                  .setValue(state.callingCodes[0]);
              }
            });
          }
        });
      });
  }

    // view the phone
    viewPhone(phone: string, prefix: string) {
      return this.formUtil.formatPhoneNumber(phone,prefix);
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

            if (ans.data) {
              const phoneFormater = this.formUtil.formatPhoneNumber(String(ans.data.CLIENT_TEL),String(ans.data.CLIENT_PREFIX));
              this.formData
                .get('prefix_receiver_phone')
                .setValue(String(ans.data.CLIENT_PREFIX));
              this.formData.get('receiver_phone').setValue(phoneFormater);
              this.formData
                .get('receiver_firstname_and_lastname')
                .setValue(
                  ans.data.CLIENT_FIRST_NAME  ? ans.data.CLIENT_FIRST_NAME : ans.data.CLIENT_LAST_NAME
                );
            }
          }
        });
      });
  }

  // Add Package
  addPackage() {
    if (this.formUtil.validatePhoneFormat(this.formData.value.receiver_phone,this.formData.value.prefix_receiver_phone)) {
      this.packetList.push({
        tracking_number: this.tracking.generateTracking(),
        prefix_receiver_phone: this.formData.value.prefix_receiver_phone,
        receiver_phone: this.formUtil.formatPhone(this.formData.value.receiver_phone),
        receiver_firstname_and_lastname:
          this.formData.value.receiver_firstname_and_lastname,
        bag_number: this.formData.value.bag_number,
        weight: this.formData.value.weight,
        volume: this.formData.value.volume,
        reception_date: this.dateService.formatDateTiret(
          this.formData.value.reception_date
        ),
        shipping_type: this.formData.value.shipping_type,
        amount_paid: this.formData.value.amount_paid,
      });

      this.formData.get('tracking_number').setValue('');
      this.formData.get('receiver_firstname_and_lastname').setValue(' ');
      this.formData.get('bag_number').setValue(' ');
      this.formData.get('weight').setValue(' ');
      this.formData.get('volume').setValue(' ');
      this.errorPhone = true;
      this.formData.get('receiver_phone').setValue('6');
      setTimeout(() => {
        this.formData.controls['receiver_phone'].setErrors({pattern: false});
        this.formData.controls['receiver_phone'].updateValueAndValidity();
      }, 300);
    } else {
      this.errorPhone = true;
    }
    this.content.scrollToBottom(300);

  }

  // Remove contact
  removeContact(index: number) {
      this.packetList.splice(index, 1);
  }

  // Get the list of shipping type
  getListOfShippingType() {
    this.loadingType = true;
    this.tracking.getSendingMode().subscribe(
      (reponse: any) => {
        this.loadingType = false;
        if (reponse && reponse.message === 'success') {
          if (reponse.shipping_type && reponse.shipping_type.length > 0) {
            this.zone.run(() => {
              this.shippingList = reponse.shipping_type;
            });

            if (this.shippingList && this.shippingList.length) {
              setTimeout(() => {
                this.formData
                  .get('shipping_type')
                  .setValue(this.shippingList[1].TYPE_ID);
              }, 500);
            }
          }
        }
      },
      (error) => {
        this.loadingType = false;
        this.errorService.manageError(error);
      }
    );
  }

  // Get the list of shipping type
  getListOfAgencies() {
    this.loadingType = true;
    this.tracking.getAgencies().subscribe(
      (reponse: any) => {
        this.loadingType = false;
        if (reponse && reponse.message === 'success') {
          if (reponse.agences && reponse.agences.length > 0) {
            this.zone.run(() => {
              this.agenciesList = reponse.agences;
            });

            if (this.agenciesList && this.agenciesList.length) {
              setTimeout(() => {
                this.formData
                  .get('agence_destination_id')
                  .setValue(this.agenciesList[0].AGENCE_ID);
                this.formData
                  .get('agence_departure_id')
                  .setValue(this.agenciesList[1].AGENCE_ID);
              }, 500);
            }
          }
        }
      },
      (error) => {
        this.loadingType = false;
        this.errorService.manageError(error);
      }
    );
  }

  // save the package
  savePackage() {
    this.loading = true;
    this.translate.get('SAVING').subscribe((trans) => {
      this.ui.presentLoading(trans);
    });

    const packetList = this.packetList;
    if (this.canAddNewPackage()) {
        packetList.push({
          tracking_number: this.tracking.generateTracking(),
          prefix_receiver_phone: this.formData.value.prefix_receiver_phone,
          receiver_phone:this.formUtil.formatPhone(this.formData.value.receiver_phone),
          receiver_firstname_and_lastname:
            this.formData.value.receiver_firstname_and_lastname,
          bag_number: this.formData.value.bag_number,
          weight: this.formData.value.weight,
          volume: this.formData.value.volume,
          reception_date: this.dateService.formatDateTiret(
            this.formData.value.reception_date
          ),
          shipping_type: this.formData.value.shipping_type,
          amount_paid: this.formData.value.amount_paid,
        });
    }

    this.formData.get('paquet').setValue(packetList);

    const param = {
      agence_departure_id : this.formData.value.agence_departure_id,
      agence_destination_id: this.formData.value.agence_destination_id,
      paquet : this.formData.value.paquet
    };

    this.tracking
      .savePackage(param)
      .subscribe(
        (reponse: any) => {
          if (reponse && reponse.message === 'success') {
            this.ui.dismissLoading();
            this.loading = false;
            this.packetList = [];
            this.initFormData();
            this.translate.get('PACKAGE_SAVE_SUCCESS_TEXT').subscribe((value) => {
              this.ui.presentToast(value);
            });
            this.event.publish('new-package');
            this.tracking.sendCreatePackage(reponse.paquet);
            this.nav.setDirection('root');
            this.router.navigate(['home','show-package']);
          } else {
            this.ui.dismissLoading();
          }
        },
        (error) => {

          if (error && error.error && !error.error.success) {
            if (error && error.error && error.error.user_not_found) {
              this.errorService.renewSession().then((data: any) => {
                if (data && data.result === 'OK') {
                  this.savePackage();
                } else {
                  this.ui.dismissLoading();
                  this.loading = false;
                }
              });
            } else if(error.error.package_code_already_exist) {

              if (param && param.paquet && param.paquet.length > 0) {
                const newParam = [];
                param.paquet.forEach((packet,index,arr) => {
                  newParam.push(packet);
                  newParam[index].tracking_number = this.tracking.generateTracking();
                });
                this.packetList = [];
                this.packetList =  newParam;
                this.savePackage();

              } else {
                this.ui.dismissLoading();
                this.loading = false;
                this.trackingError.manageTrackingError(error);
              }

            } else {
              this.ui.dismissLoading();
              this.loading = false;
              this.trackingError.manageTrackingError(error);
            }

          } else {
            this.ui.dismissLoading();
            this.loading = false;
            this.errorService.manageError(error);
          }
        }
      );
  }
}
