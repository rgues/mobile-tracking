import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthErrorService {

  constructor(
    private translate: TranslateService,
    private ui: UiService
  ) { }


  // show the auth api error
  manageAuthError(error: any) {

    if (error.error.invalid_credential) {
      this.translate.get('INVALID_CREDENTIALS_TEXT').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.account_is_not_activated) {
      this.translate.get('ACCOUNT_NOT_ACTIVATED_TEXT').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

  }




}
