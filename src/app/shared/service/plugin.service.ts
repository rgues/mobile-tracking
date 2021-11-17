import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { UiService } from './ui.service';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';

@Injectable({
  providedIn: 'root',
})
export class PluginsService {
  shareData: any;
  package: any;
  static scannerOn = true;
  currentDate: any;

  constructor(
    private camera: Camera,
    private translate: TranslateService,
    private printer: Printer,
    private ui: UiService,
    private screenshot: Screenshot,
    private socialSharing: SocialSharing,
    private qrScanner: QRScanner
  ) {
    this.shareData = [];
    this.currentDate = new Date();
  }

  // Get a picture
  getPicture() {
    return new Observable((subscriber) => {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        mediaType: this.camera.MediaType.PICTURE,
        encodingType: this.camera.EncodingType.JPEG,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          subscriber.next(base64Image);
        },
        (err) => {
          subscriber.next(null);
        }
      );
    });
  }

  // Take a picture
  takePicture() {
    return new Observable((subscriber) => {
      const options: CameraOptions = {
        quality: 50,
        cameraDirection: this.camera.Direction.FRONT,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        sourceType: this.camera.PictureSourceType.CAMERA,
      };
      this.camera.getPicture(options).then(
        (imageData) => {
          let base64Image = 'data:image/jpeg;base64,' + imageData;
          subscriber.next(base64Image);
        },
        (err) => {
          subscriber.next(err);
        }
      );
    });
  }

  // share fucntion
  share(message: string, title: string, link: string) {
    this.socialSharing
      .share(message, title, '', link)
      .then(() => {})
      .catch(() => {});
  }

  // hide the QR code
  hideQRcode() {
    this.qrScanner.getStatus().then((status) => {
      if (status && status.scanning) {
        this.qrScanner.hide();
      }
    });
  }

  // scan a QR-code
  scanQrCode() {
    // test data
    this.package = {
      AGENCE_ID: 1,
      CLIENT_ID: null,
      PACKAGE_CODE: 'JFI2021109111',
      PACKAGE_LABEL: 'la montre',
      PACKAGE_DESCRIPTION: 'la montre',
      PACKAGE_WEIGHT: 12,
      PACKAGE_VOLUME: null,
      PACKAGE_SHIPPING_DATE: null,
      PACKAGE_RECEPTION_DATE: '2021-09-03',
      PACKAGE_ARRIVAL_ESTIMATION_DATE: '2021-09-03',
      PACKAGE_DESTINATION_CITY: '3',
      PACKAGE_START_CITY: '1',
      RECEIVER_NAME: 'Kamen',
      RECEIVER_LAST_NAME: 'Rodrigues',
      RECEIVER_PHONE_NUMBER: '676622933',
      SENDER_NAME: null,
      SENDER_FIRST_NAME: null,
      DATE_TIME: '2021-09-03T15:55:08.000000Z',
      TYPE_ID: 1,
      PREFIX_RECEIVER_PHONE: null,
    };

    return new Observable((subscriber) => {
      this.qrScanner
        .prepare()
        .then((status: QRScannerStatus) => {
          // this.ui.presentAlert('prepare result', JSON.stringify(status));
          if (status.authorized) {
            // camera permission was granted
            PluginsService.scannerOn = true;
            // start scanning
            this.qrScanner.show(); // show camera preview

            let scanSub = this.qrScanner.scan().subscribe(
              (text: string) => {
                // this.ui.presentAlert('scan result', JSON.stringify(text));
                PluginsService.scannerOn = false;
                subscriber.next({ result: 'success', data: text });
                this.qrScanner.hide(); // hide camera preview
                scanSub.unsubscribe(); // stop scanning
              },
              (err) => {
                subscriber.next({ result: 'error', data: '' });
              }
            );
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
            subscriber.next({ result: 'denied', data: '' });
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            subscriber.next({ result: 'denied', data: '' });
          }
        })
        .catch((e: any) => {
          subscriber.next({ result: 'error', data: '' });
          // subscriber.next({result: 'error', data: this.package});
        });
    });
  }

  // make a screenshot
  screenShootSave() {
    return new Observable((subscriber) => {
      // Take a screenshot and save to file
      this.screenshot
        .save(
          'jpg',
          80,
          `DOC-${this.currentDate.getFullYear()}-${Math.floor(
            Math.random() * 1000
          )}`
        )
        .then(
          (onSuccess) => {
          //  this.ui.presentAlert('SCREENSHOT SUCCESS', JSON.stringify(onSuccess));
            this.translate
              .get('PRINT_SAVE_SUCCESS', { path: onSuccess.filePath })
              .subscribe((trans) => {
                this.ui.presentAlert('', trans);
              });
            subscriber.next(true);
          },
          (onError) => {
          //  this.ui.presentAlert('SCREENSHOT ERROR', JSON.stringify(onError));
            this.translate.get('PRINT_ERROR').subscribe((trans) => {
              this.ui.presentAlert('', trans);
            });
            subscriber.next(false);
          }
        );
    });
  }

  screenShootHTML() {
    return new Observable((subscriber) => {
      // Take a screenshot and get temporary file URI
      this.screenshot.URI(80).then(
        (onSuccess) => {
       // this.ui.presentAlert('SCREENSHOT SUCCESS', JSON.stringify(onSuccess));
          const html = '<img style="width:50%;" src="'+onSuccess.URI+'">';
          subscriber.next(html);
        },
        (onError) => {
       // this.ui.presentAlert('SCREENSHOT ERROR', JSON.stringify(onError));
          subscriber.next(null);
        }
      );
    });
  }

  // print a document
  printDocument(content: any) {
    return new Observable((subscriber) => {
      // Take a screenshot and save to file

      this.printer.isAvailable().then((onSuccess) => {
      //  this.ui.presentAlert('PRINT CHECK SUCCESS', JSON.stringify(onSuccess));
        let options: PrintOptions = {
          name: 'JFI EXPRESS RECEIPT',
          duplex: true,
          orientation: 'landscape', //'landscape',
          monochrome: true,
        };
        this.printer.print(content, options).then(onSuccess => {
         // this.ui.presentAlert('PRINT SUCCESS', JSON.stringify(onSuccess));
         this.translate.get('PRINT_SUCCESS').subscribe((trans) => {
          this.ui.presentAlert('', trans);
         });
          subscriber.next(true);
        }, onError => {
          subscriber.next(false);
         // this.ui.presentAlert('PRINT ERROR', JSON.stringify(onError));
          this.translate.get('PRINT_ERROR').subscribe((trans) => {
            this.ui.presentAlert('', trans);
          });
        });
      }, onError => {
        subscriber.next(false);
       // this.ui.presentAlert('PRINT CHECK ERROR', JSON.stringify(onError));
        this.translate.get('PRINT_UNVALAIBLE').subscribe((trans) => {
          this.ui.presentAlert('', trans);
        });
      });

  });
}
}
