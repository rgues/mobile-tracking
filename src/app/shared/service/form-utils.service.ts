import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  constructor() {}

  // Get the troncate name
  troncateName(value: string, nbDigit: number) {
    return value && value.length < nbDigit
      ? value
      : value
      ? value.substring(0, nbDigit) + '...'
      : '';
  }

  // Remove space
  removeSpace(inputData: any) {
    const input = String(inputData);
    return input.replace(/\s/g, '');
  }

  validateEmail(myEmail: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}[.][a-z]{2,4}$/;
    if (!regex.test(myEmail)) {
      return false;
    } else {
      return true;
    }
  }

  validatePhone(myPhone: string) {
    const regex = /^[0-9]{9,11}$/;
    if (!regex.test(myPhone)) {
      return false;
    } else {
      return true;
    }
  }

  validatePhoneFormat(myPhone: string,prefix: string) {
    let regex = {};
    regex['237'] = /^6 \d{2}-\d{2}-\d{2}-\d{2}$/;
    regex['86'] = /^\d{3}-\d{4}-\d{4}$/;
    regex['33'] = /^\d{1} \d{2}-\d{2}-\d{2}-\d{2}$/;
    regex['1'] = /^[(]\d{3}[)] \d{3}-\d{4}$/;
    if (regex[prefix] && regex[prefix].test(myPhone)) {
      return true;
    } else {
      return false;
    }
  }

  // get the format
  getPhoneFormat(prefix: string) {
    let regex = {};
    regex['237'] = /^(\d{1})?(\d{1,2})?(\d{2})?(\d{2})?(\d{2})$/;
    regex['86'] = /^(\d{1,3})?(\d{1,4})?(\d{4})$/;
    regex['33'] = /^(\d{1})?(\d{1,2})?(\d{2})?(\d{2})?(\d{2})$/;
    regex['1'] = /^(\d{1,3})?(\d{1,3})?(\d{4})$/;
    if (regex && regex[prefix]) {
        return regex[prefix];
    } else {
        return /^\d{6,13}$/
    }
  }

  formatPhoneNumber(phoneNumberString: string,prefix: string) {

    let cleaned = this.formatPhone(phoneNumberString);
    const match = cleaned.match(this.getPhoneFormat(prefix));

    switch(prefix) {
      case '237' :
        if (match) {
          return (match[1] ? match[1] + ' ' : '') + ( match[2] ? match[2] + '-' : '' ) + ( match[3] ?  match[3] + '-' :  '') + (match[4] ? match[4]+ '-' : '' ) + (match[5] ? match[5] :'');
        }
        break;
      case '86' :
        if (match) {
          return  (match[1] ? match[1] + '-' : '') + ( match[2] ? match[2] + '-' : '' ) + ( match[3] ?  match[3] :  '');
        }
        break;
      case '33' :
        if (match) {
          return (match[1] ? match[1] + ' ' : '') + ( match[2] ? match[2] + '-' : '' ) + ( match[3] ?  match[3] + '-' :  '') + (match[4] ? match[4]+ '-' : '' ) + (match[5] ? match[5] :'');
        }
        break;
      case '1' :
        if (match) {
          return  (match[1] ? '(' + match[1] + ') ' : '') + ( match[2] ? match[2] + '-' : '' ) + ( match[3] ?  match[3] :  '');
        }
        break;
      default:
        break;
    }

    return phoneNumberString;
  }



  // format phone
  formatPhone(phoneNumberString: string) {

    let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    cleaned = cleaned.replace('-', '');
    cleaned = cleaned.replace('(', '');
    cleaned = cleaned.replace(' ', '');
    cleaned = cleaned.replace(')', '');

    return cleaned;

  }

  validatePin(myPin: string) {
    const regex = /^[0-9]{5}$/;
    if (!regex.test(myPin)) {
      return false;
    } else {
      return true;
    }
  }

  validateMisaPrix(miseAprix: string) {
    const regex = /^[0-9]+$/;
    if (!regex.test(miseAprix)) {
      return false;
    } else {
      return true;
    }
  }

  // Get a random id
  getRandomId(): string {
    let text = 'M';
    const possible = 'ABCDEFGHJKLMPQRSTUVWXYZabcdefghjklmpqrstuvwxyz';
    const chiffre = '0123456789';
    for (let i = 0; i <= 5; i++) {
      text += chiffre.charAt(Math.floor(Math.random() * chiffre.length));
    }
    return text;
  }

  // Get a random id
  getRandomValue(nbMax: number): number {
    return Math.floor(Math.random() * nbMax) + 1;
  }


}
