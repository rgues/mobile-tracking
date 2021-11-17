import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class UserErrorService {

  constructor(
    private translate: TranslateService,
    private ui: UiService
  ) { }


  // show the user api error
  manageUserError(error: any) {

    if (error.error) {
      this.translate.get('').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

  }

}
