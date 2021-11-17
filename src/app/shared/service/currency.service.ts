import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  public static currencyRate = {
    path: '/api/live?access_key=' + ConstantService.accessKeyCurrency,
    method: 'GET',
    params: ['base'], // base=USD indique USD comme devise de base
    description: 'permet de recuperer le cours des devises'
  };

  public static convertRate(ratefrom: string, to: string, amount: number): any {
    return {
      path: '/api/convert?access_key=' + ConstantService.accessKeyCurrency
        + '&from=' + ratefrom
        + '&to=' + to
        + '&amount=' + amount
        + '& format=1',
      method: 'GET',
      params: ['base'], // base=USD indique USD comme devise de base
      description: 'permet de recuperer le cours des devises'
    };
  }

  constructor(
    private http: HttpClient
  ) {

  }

  // Get all the currencies rate
  getCurrencyRate(): Observable<any> {
    return this.http.get(ConstantService.baseUrlCurrencyRate + CurrencyService.currencyRate.path);
  }

  // Get a conversion From currency to another one
  getConvertionRate(ratefrom: string, to: string, amount: number): Observable<any> {
    return this.http.get(ConstantService.baseUrlCurrencyRate + CurrencyService.convertRate(ratefrom, to, amount).path);
  }

  // Get the rate of conversion
  rateConvert(rateFrom: number, rateTo: number, value: number): number {
    return (value * (1 / rateFrom)) * rateTo;
  }

  // get the convertion rate
  conversionRateValue(cuurencyFrom: string, currencyTo: string) {
    return new Promise((resolve) => {
      this.getSelfConvertionRate().subscribe((data) => {
        const value = data.quotes['USD' + currencyTo] / data.quotes['USD' + cuurencyFrom];
        if (value > 20) {
          resolve(Number((value + 0.02)).toFixed(6));
        } else {
          resolve(Number((value + 0.00002)).toFixed(6));
        }

      }, error => {
        resolve(0);
      });
    });
  }

  getSelfConvertionRate(): Observable<any> {
    return this.http.get(ConstantService.baseUrlCurrencyRate + CurrencyService.currencyRate.path);
  }

  // Fisrt conversion of o a currency
  convert(convertFrom, convertTo, myAmout) {
    return new Promise((resolve) => {

        this.getSelfConvertionRate().subscribe((data) => {
          const value = this.rateConvert(data.quotes['USD' + convertFrom], data.quotes['USD' + convertTo], myAmout);
          if (convertTo === 'XAF' || convertTo === 'XOF' || convertTo === 'ZAR') {
            resolve(Number((Math.ceil(value + 0.02))).toFixed(2));
          } else {
            resolve(Number((value + 0.02)).toFixed(2));
          }
        }, error => {
          resolve(null);
        });

    });
  }
}
