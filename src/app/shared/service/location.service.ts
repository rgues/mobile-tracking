import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {


  private subject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private translate: TranslateService,
    private localStorage: LocalStorageService,
    private util: UtilService
  ) {

  }

  sendTranslation(dataTranslation: any) {
    this.subject.next({ translation: dataTranslation });
  }

  getTranslation(): Observable<any> {
    return this.subject.asObservable();
  }

  // set the current country code
  setAllCountriesData(countries: any) {
    this.localStorage.setItem('countries', countries);
  }

  // Get the currentCounty code
  getAllCountriesData() {
    const countries = this.localStorage.getItem('countries');
    return countries ? countries : [];
  }

  // set the current country code
  setCurrentCountryPrefix(code: string) {
    this.localStorage.setItem('country_code', code);
  }

  // Get the currentCounty code
  getCurrentCountyPrefix() {

    return this.localStorage.getItem('country_code');
  }

  // Get the current user country
  getAllCountry() {
    const countries = this.localStorage.getItem('all-countries');
    return countries ? countries : [];
  }

  // Set the current user country
  setAllCountry(countryData: any) {
    this.localStorage.setItem('all-countries',countryData);
  }

  // Get the current user country
  removeAllCountry() {
    this.localStorage.removeItem('all-countries');
  }

  // Get the current user country
  getCurrentUserCountry() {
    return this.localStorage.getItem('user-country');
  }

  // Set the current user country
  setCurrentUserCountry(countryData: any) {
    this.localStorage.setItem('user-country',countryData);
  }

  // get the current user country
  removeCurrentUserCountry() {
    this.localStorage.removeItem('user-country');
  }

  // Get the current user Language
  getCurrentUserLanguage() {
    return this.localStorage.getItem('user-language');
  }

  // Set the current user Language
  setCurrentUserLanguage(countryData: any) {
    this.localStorage.setItem('user-language', countryData);
  }

  // get the current user Language
  removeCurrentUserLanguage() {
    this.localStorage.removeItem('user-language');
  }

  // Get current user position
  getPositionUser() {
    return this.http.get(`${ConstantService.baseUrlIp}json/?key=${ConstantService.accessKeyIp}`);
  }

  // get all countries
  getAllcountriesData() {
    return new Observable((observer) => {
/*     this.http.get(`${ConstantService.baseUrlCountries}all`).subscribe((countries: any) => {
        observer.next(countries);
      }, error => {
        this.http.get(`assets/json/countries.json`).subscribe((countries: any) => { observer.next(countries); });
      }); */

      this.http.get(`assets/json/countries.json`).subscribe((countries: any) => {

        const countriesAvailables = [];
        countries.forEach(data => {
            if (data && data.alpha2Code === 'CM' ||  data.alpha2Code === 'FR' || data.alpha2Code === 'CN' || data.alpha2Code === 'US') {
              countriesAvailables.push(data);
            }
        });
        observer.next(countriesAvailables);

      });
    });

  }

  // Get all the word countries
  }
