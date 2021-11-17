import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class StorageData {

  constructor(
    private storage: Storage
  ) { }

 async set(key: string, value: any) {
  await this.storage.set(`${ConstantService.APP_PREFIX}${key}`, value);
  }

  async get(key: string) {
   return await this.storage.get(`${ConstantService.APP_PREFIX}${key}`);
  }

  async remove(key: string) {
    await this.storage.remove(`${ConstantService.APP_PREFIX}${key}`);
  }

}
