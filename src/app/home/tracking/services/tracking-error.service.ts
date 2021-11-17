import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingErrorService {

  constructor(
    private translate: TranslateService,
    private ui: UiService
  ) { }


  // show the tracking api error
  manageTrackingError(error: any) {

    if (error.error.package_code_not_exist) {
      this.translate.get('PACKAGE_CODE_NOT_EXIST').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.this_package_is_not_already_arrived_to_destination) {
      this.translate.get('PACKAGE_IS_NOT_ATTEND_DESTINATION').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.this_package_is_already_checkout) {
      this.translate.get('PACKAGE_ALREADY_CHECKOUT').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.this_package_code_is_not_arrived) {
      this.translate.get('PACKAGE_CODE_NOT_ARRIVED').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.remplir_tous_les_champs) {
      this.translate.get('FILL_ALL_FIELDS_TEXT').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.agence_departure_is_equal_to_agence_destination) {
      this.translate.get('SAME_AGENCY_ERROR_MSG').subscribe(value => {
        this.ui.presentToast(value);
      });
    }

    if (error.error.package_code_already_exist) {
      this.translate.get('PACKAGE_CODE_ALREADY_EXIST_MSG',{trackingCode: error.error.value_package_code }).subscribe(value => {
        this.ui.presentToast(value);
      });
    }

  }




}
