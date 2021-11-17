import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateserviceService {

  constructor() { }
  
  getDateTimeUniversal(date: string, time: string, from: string) {

    const myDates = this.decodeDate(date);
    const myTimes = this.decodeTime(time);
    const objectMyDate = new Date(Number(myDates.year), Number(myDates.month - 1), Number(myDates.day), Number(myTimes.heure),
     Number(myTimes.minutes), 0, 0);
    let objectMyDateUniversal = {};

    if (from === 'l') {
      objectMyDateUniversal = new Date(objectMyDate.valueOf() + objectMyDate.getTimezoneOffset() * 60000);
    } else {
      objectMyDateUniversal = new Date(objectMyDate.valueOf() - objectMyDate.getTimezoneOffset() * 60000);
    }

    const dateFormater = this.formatterDate(objectMyDateUniversal);
    return dateFormater;

  }

  encodeTime(hour: string, minute: string) {
    const mTime = hour + ':' + minute;
    return mTime;
  }


  addDays(theDate, days) {
    return new Date(theDate.getTime() + days*24*60*60*1000);
  }

    // get the remain time
    getRemainTime(data: any) {
      let timeRemainHour = 0;
      const currentDate = new Date ();
      const created = new Date(data.updated_at ? data.updated_at : data.created_at);
      const expiredDate = this.addDays(created,3);
      const remainTime = expiredDate.getTime() - currentDate.getTime();
      if (remainTime > 0) {
       timeRemainHour = Math.floor(remainTime/3600000);
      }

      return timeRemainHour;
    }

  decodeTime(time: string) {

    const times = time.split(':');
    const myTime = {
      heure: times[0],
      minutes: times[1],
      secondes: times[2],
    };

    return myTime;
  }


  decodeDate(myDate) {

    const mDates = myDate.split('-');
    const mDate = {
      year: mDates[0],
      month: mDates[1],
      day: mDates[2]

    };
    return mDate;
  }

  encodeDate(day: string, month: string, year: string) {
    const mDate = year + '-' + month + '-' + day;
    return mDate;
  }

  formatterDate(date: any) {

    const year = String(date.getFullYear());
    const month = String(('0' + (date.getMonth() + 1)).slice(-2));
    const day = String(('0' + date.getDate()).slice(-2));
    const hour = String(('0' + date.getHours()).slice(-2));
    const minute = String(('0' + date.getMinutes()).slice(-2));
    const myFormatDate = {
      date: year + '-' + month + '-' + day,
      time: hour + ':' + minute,
    };
    return myFormatDate;
  }

  formatDateSplash(date: any) {
    const dateFormat = new Date(date);
    const month = (dateFormat.getMonth() + 1 < 10) ? '0' + (dateFormat.getMonth() + 1) : (dateFormat.getMonth() + 1);
    const day = dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate();
    const formatDate = day + '/' + month + '/' +  dateFormat.getFullYear();
    return formatDate;
  }

  formatDateSplashReverse(date: any) {
    const dateFormat = new Date(date);
    const month = (dateFormat.getMonth() + 1 < 10) ? '0' + (dateFormat.getMonth() + 1) : (dateFormat.getMonth() + 1);
    const day = dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate();
    const formatDate =   dateFormat.getFullYear() + '/' + month + '/' +  day;
    return formatDate;
  }

  formatDateTiret(date: any) {
    const dateFormat = new Date(date);
    const month = (dateFormat.getMonth() + 1 < 10) ? '0' + (dateFormat.getMonth() + 1) : (dateFormat.getMonth() + 1);
    const day = dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate();
    const formatDate = dateFormat.getFullYear() + '-' + month + '-' + day;
    return formatDate;
  }

  formatDate(date: any) {
    const dateFormat = new Date(date);
    const month = (dateFormat.getMonth() < 10) ? '0' + (dateFormat.getMonth()) : (dateFormat.getMonth());
    const day = dateFormat.getDate() < 10 ? '0' + dateFormat.getDate() : dateFormat.getDate();
    const formatDate = dateFormat.getFullYear() + '-' + month + '-' + day;
    return formatDate;
  }

   // Filter the date
   filterDate(date: string) {
    return new Date(date);
  }
}
