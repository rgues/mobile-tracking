import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ApiService } from 'src/app/shared/service/api.service';
import { EventService } from 'src/app/shared/service/events.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  token: string;

  constructor(
    private api: ApiService,
    private event: EventService,
    private auth: AuthService,
    private http: HttpClient,
    private localStorage: LocalStorageService
  ) {
      this.token = this.auth.getToken();
      this.event.subscribe('new-token', token => {
        this.token = token;
      });
  }

  // send Data
  sendData(data) {
    this.localStorage.setItem('tracking-data', data);
  }

  // Get Data
  getData() {
    return this.localStorage.getItem('tracking-data');
  }

   // send Data
   sendCreatePackage(data) {
    this.localStorage.setItem('create-data', data);
  }

  // Get Data
  getCreatePackage() {
    return this.localStorage.getItem('create-data');
  }

  /*===== services for tracking a package start ========*/

  // get logo
  showLogo(url, logo) {
    return this.http.get(`${url}${logo}`);
  }

  // Get all informations about a package
  getPackageData(packageCode: string) {
    return this.api.get('list_package/get_infos/' + packageCode);
  }

  // Get the list of all package
  getAllPackages() {
    return this.api.get('list_package/list_mobile');
  }

  // Get the list of all packagea
  updatePackageStatut(packageCode: string) {
    return this.api.get('update/valid_and_notif_user/' + packageCode + '/'+ this.token);
  }

  // Checkout a package
  checkoutPackage(packageCode: any) {
    return this.api.post('checkout/package/mobile'+ '/' + this.token, packageCode);
  }

  // resend the sms
  resendSMSPackage(packageCode: any) {
    return this.api.get('update/resendSMS/' + packageCode + '/'+ this.token);
  }

  // get all agencies
  getAgencies() {
    return this.api.get('package/getAllAgences');
  }

  // get all sending mode
  getSendingMode() {
    return this.api.get('package/getAllShippingType');
  }

  // get all customers
  getAllCustomers() {
    return this.api.get('package/getAllClients');
  }

  // save a package
  savePackage(packageCode: any) {
    return this.api.post('package/save_air' + '/' + this.token, packageCode);
  }

  // get customer reports
  getCustomersReport(phone: string) {
    return this.api.get(`report_package_customer/show_mobile/${phone}`);
  }

  // Generate tracking number
  generateTracking() {
    // tracking_number = label_package + année + mois + random 2 caractères en majuscule + random de 2 entier
    // label_package est obtenu dans la route 1 qui renvoie les informations de l'organisation
    const Alpha = `ABCDEFGHIJKLMNOPQRSTUVWXYZ`;
    const Num = `0123456789`;
    const currentDate =  new Date();
    const organisationData = this.localStorage.getItemSecure('organisation-data') || 'JFI';
    const trackingNumber = `${organisationData.label_package}${currentDate.getFullYear()}${currentDate.getMonth()}${Alpha.charAt(Math.floor(Math.random()*Alpha.length))}${Alpha.charAt(Math.floor(Math.random()*Alpha.length))}${Num.charAt(Math.floor(Math.random()*Num.length))}${Num.charAt(Math.floor(Math.random()*Num.length))}`;
    return trackingNumber;
  }


  getQrCode(data: any) {

    let qrcodeData = {};

    if (data) {
       qrcodeData = {
        AGENCE_ID: data.AGENCE_ID,
        CLIENT_ID: data.CLIENT_ID,
        PACKAGE_CODE: data.PACKAGE_CODE,
        PACKAGE_LABEL: data.PACKAGE_LABEL,
        PACKAGE_DESCRIPTION: data.PACKAGE_DESCRIPTION,
        PACKAGE_WEIGHT: data.PACKAGE_WEIGHT,
        PACKAGE_VOLUME: data.PACKAGE_VOLUME,
        PACKAGE_SHIPPING_DATE: data.PACKAGE_SHIPPING_DATE,
        PACKAGE_RECEPTION_DATE: data.PACKAGE_RECEPTION_DATE,
        PACKAGE_ARRIVAL_ESTIMATION_DATE: data.PACKAGE_ARRIVAL_ESTIMATION_DATE,
        PACKAGE_DESTINATION_CITY: data.PACKAGE_DESTINATION_CITY,
        PACKAGE_START_CITY: data.PACKAGE_START_CITY,
        RECEIVER_NAME: data.RECEIVER_NAME,
        RECEIVER_LAST_NAME: data.RECEIVER_LAST_NAME,
        RECEIVER_PHONE_NUMBER: data.RECEIVER_PHONE_NUMBER,
        SENDER_NAME: data.SENDER_NAME,
        SENDER_FIRST_NAME: data.SENDER_FIRST_NAME,
        DATE_TIME: data.DATE_TIME,
        TYPE_ID: data.TYPE_ID,
        PREFIX_RECEIVER_PHONE: data.TYPE_ID,
        updated_at: data.updated_at,
        created_at: data.updated_at,
        PACKAGE_ID: data.PACKAGE_ID
      };
    }

     return JSON.stringify(qrcodeData);
  }

  /** ============ services for tracking a package end ============= */
}
