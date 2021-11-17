import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public static baseUrlApi =  'https://tracking.jfiexpress.com/';
  public static baseUrlApiDev =  'https://trackingdev.jfiexpress.com/';
  public static baseUrlCurrencyRate = 'https://apilayer.net';
  public static accessKeyCurrency = 'f68da29e3769951bc2f8f9b94b3ce652';
  public static baseUrlCountries = 'https://restcountries.eu/rest/v2/';
  public static baseUrlIp = 'https://pro.ip-api.com/';
  public static accessKeyIp = 'OTLs8gHCV0rJyYz';
  public static APP_PREFIX = 'JFIEXPRESS-V1-';

  constructor(
  ) {

  }

}

