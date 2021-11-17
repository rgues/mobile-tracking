
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';
import { Package } from '../tracking/models/package';


@Component({
  selector: 'app-track-package',
  templateUrl: './track-package.component.html',
  styleUrls: ['./track-package.component.scss'],
})
export class TrackPackageComponent implements OnInit {

  package: Package;
  organisation: any;
  amount: any;
  statut: string;

  constructor(
    private navparams: NavParams,
    private localStorage: LocalStorageService,
    private modal: ModalController
  ) {
       this.package = this.navparams.get('data');
       this.statut = this.navparams.get('statut');
       this.amount = this.navparams.get('amount');
       this.organisation = this.localStorage.getItemSecure('organisation-data');
  }

  ngOnInit() {}


  // cancel le modal
  cancelModal() {
    this.modal.dismiss();
  }

}
