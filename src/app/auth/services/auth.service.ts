import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/service/api.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string;

  constructor(
    private api: ApiService,
    private localStorage: LocalStorageService
  ) {}


    // Send Data
    setCredentials(data) {
      this.localStorage.setItemSecure('user-credentials', data);
    }

    // Get Data
    getCredentials() {
      return this.localStorage.getItemSecure('user-credentials');
    }

  // Send Data
  setData(data) {
    this.localStorage.setItemSecure('user-data', data);
  }

  // Get Data
  getData() {
    return this.localStorage.getItemSecure('user-data');
  }

  // Send Data
  setToken(token: string) {
    this.localStorage.setItem('user-token', token);
  }

  // Get Data
  getToken() {
    return this.localStorage.getItem('user-token');
  }

  /*===== services for auth start ========*/



  authentication(data: any) {
    return this.api.post('user/login_mobile', data);
  }

  // Get organisation informations
  getOrganisationsInfos() {
    return new Observable((observer) => {
      this.api.get('organisation/get/infos').subscribe(
        (data) => {
          if (data && data.message === 'success') {
            this.localStorage.setItemSecure(
              'organisation-data',
              data.organisation
            );
            observer.next(data.organisation);
          }
        },
        (error) => {
          const organisationData =
            this.localStorage.getItemSecure('organisation-data');
          if (organisationData) {
            observer.next(organisationData);
          } else {
            observer.next(null);
          }
        }
      );
    });
  }


    // log out the user
    logoutMember() {
      this.localStorage.removeItem('user-data');
      this.localStorage.removeItem('user-token');
      this.localStorage.removeItem('user-credentials');
      this.localStorage.removeItem('startRefreshToken');
    }

  /** ============ services for auth end ============= */
}
