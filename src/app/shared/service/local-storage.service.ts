import { Injectable } from '@angular/core';

import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any) {
    localStorage.setItem(`${ConstantService.APP_PREFIX}${key}`, JSON.stringify(value));
  }

  getItem(key: string) {
    const data =  localStorage.getItem(`${ConstantService.APP_PREFIX}${key}`);
    return data  ? JSON.parse(data) : null;
  }

  removeItem(key: string) {
    localStorage.removeItem(`${ConstantService.APP_PREFIX}${key}`);
  }

  // get item secure
  getItemSecure(key: string): any {
    const data = localStorage.getItem(`${ConstantService.APP_PREFIX}${key}`);
    return data && atob(data) ? JSON.parse(atob(data)) : null;
  }

  // Set item secure
  setItemSecure(key: string, value: any) {
    localStorage.setItem(`${ConstantService.APP_PREFIX}${key}`, btoa(JSON.stringify(value)));
  }

}
