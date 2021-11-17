import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ToastController,
  LoadingController,
  AlertController,
  Platform
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isLoadingShow = false;
  navLinksArray: any;
  constructor(
    public toastController: ToastController,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private translate: TranslateService,
    private router: Router,
    private platform: Platform
  ) {
    this.navLinksArray = [];
    this.router.events.subscribe((event) => {
      const url = this.router.url;
      if (url === '/home' || url === '/auth') {
        this.navLinksArray = [];
      } else {
        if (event instanceof NavigationEnd) {
          const isCurrentUrlSaved = this.navLinksArray.find((item) => {
            return item === url;
          });
          if (!isCurrentUrlSaved) this.navLinksArray.push(url);
        }
      }
    });
  }

  async presentAlert(title, message) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [{
        text: 'OK',
        cssClass: 'light',
        handler: () => {}}
      ],
    });

    await alert.present();
  }

  async presentLoading(messageLoading: string) {
    this.isLoadingShow = true;
    return await this.loadingController
      .create({
        message: messageLoading,
      })
      .then((a) => {
        a.present().then(() => {
          const timer = setInterval(() => {
            if (!this.isLoadingShow) {
              a.dismiss().then(() => {});
              clearTimeout(timer);
            }
          }, 2000);
        });
      });
  }

  async dismissLoading() {
    this.isLoadingShow = false;
    return await this.loadingController.dismiss().then(() => {});
  }

  async presentToast(messageParam: string) {
    const toast = await this.toastController.create({
      message: messageParam,
      duration: 5000,
      position: 'top',
    });
    toast.present();
  }

  // Listen hardware back button
  hardwareBackButton() {
    this.platform.backButton.subscribe(() => {
      if (this.navLinksArray.length > 1) {
        this.navLinksArray.pop();
        const index = this.navLinksArray.length + 1;
        const url = this.navLinksArray[index];
        this.router.navigate([url]);
      } else {
        this.hardwareBackButtonAction();
      }
    });
  }

  // confirmation message
async confirmationMessage(translation: string[]) {

  const alert = await this.alertController.create({
    header: `${translation[0]}`,
    message: `${translation[1]}`,
    buttons: [
      {
        text: `${translation[2]}`,
        role: 'cancel',
        cssClass: 'light',
        handler: () => {
          this.alertController.dismiss();
        }
      },
      {
        text: `${translation[3]}`,
        cssClass: 'light',
        handler: () => {
          navigator['app'].exitApp();
        }
      }
    ],
  });

  await alert.present();
}

// listen to back button
hardwareBackButtonAction() {
    const url = this.router.url;
    if (
      url === '/home' || url === '/auth'
    ) {
      const messages = [];
      this.translate
        .get(['M_EXIT_TITLE', 'M_EXIT_MESSAGE', 'CANCEL_TEXT', 'YES_TEXT'])
        .subscribe((trans) => {
          messages.push(trans.M_EXIT_TITLE);
          messages.push(trans.M_EXIT_MESSAGE);
          messages.push(trans.CANCEL_TEXT);
          messages.push(trans.YES_TEXT);
          this.confirmationMessage(messages);
        });
    }
}


  // Show network error Message
  async  showNetworkErrorMessage() {

    const translation = [];
    this.translate
      .get(['NETWORK_ERROR_TITLE', 'NETWORK_ERROR_MSG', 'CANCEL_TEXT'])
      .subscribe((trans) => {
        translation.push(trans.NETWORK_ERROR_TITLE);
        translation.push(trans.NETWORK_ERROR_MSG);
        translation.push(trans.CANCEL_TEXT);
      });

    const alert = await this.alertController.create({
      header: `${translation[0]}`,
      message: `${translation[1]}`,
      buttons: [
        {
          text: `${translation[2]}`,
          role: 'cancel',
          cssClass: 'light',
          handler: () => {}
        }
      ],
    });

    await alert.present();

  }

}
