import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from './ui.service';
import { LocalStorageService } from './local-storage.service';
import { EventService } from './events.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private ui: UiService,
    private auth: AuthService,
    private translate: TranslateService,
    private event: EventService,
    private localStorage: LocalStorageService
  ) { }

  // Renew the user session
  renewSession() {
    return new Promise((resolve) => {
      if (this.localStorage.getItem('startRefreshToken') === 'false') {
        const credentials = this.auth.getCredentials();
        if (credentials) {
          this.localStorage.setItem('startRefreshToken', 'true');
          this.auth.authentication(credentials).subscribe(
            (reponse: any) => {
              if (reponse && reponse.message === 'success') {
                this.event.publish('new-token', reponse.token);
                setTimeout(() => {
                  this.auth.setToken(reponse.token);
                  this.auth.setData(reponse.user);
                  this.localStorage.setItem('startRefreshToken', 'false');
                  resolve({ result: 'OK' });
                }, 4000);
              }
            }, error => {

              if (error && error.error && error.error.user_not_found) {
                this.auth.logoutMember();
              } else {
                if (error.status === 0) {
                  this.translate.get('NETWORK_ERROR_MSG').subscribe(value => {
                    this.ui.presentToast(value);
                  });
                }
              }
              resolve({ result: 'ERROR' });
            });
        } else {
          this.auth.logoutMember();
          resolve({ result: 'ERROR' });
        }
      } else {
        setTimeout(() => {
          resolve({ result: 'OK' });
        }, 6000);
      }

    });

  }

  // Manage system error
   manageError(error) {
    if (error.status === 0) {
      this.translate.get('NETWORK_ERROR_MSG').subscribe(value => {
        this.ui.presentToast(value);
      });
    } else if (error.status === 400) {
      this.renewSession();
    } else if (error.status === 401) {
      this.auth.logoutMember();
    } else if (error.status === 500) {
      this.translate.get('ERROR_SERVER_MSG').subscribe(value => {
        this.ui.presentToast(value);
      });
    } else {
      this.translate.get('ERROR_SERVER_MSG').subscribe(value => {
        this.ui.presentToast(value);
      });
    }
  }


}
