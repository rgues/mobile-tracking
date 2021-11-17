import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-checkout-result',
  templateUrl: './checkout-result.page.html',
  styleUrls: ['./checkout-result.page.scss'],
})
export class CheckoutResultPage implements OnInit {

  checkoutResult: any;

  constructor(
    private navparams: NavParams,
    private router: Router,
    private modal: ModalController,
  ) {
       this.checkoutResult = this.navparams.get('data');
  }

  ngOnInit() {
  }


  // cancel le modal
  cancelModal() {
      this.modal.dismiss();
  }

  backToScan() {
    this.cancelModal();
    this.router.navigate(['home/checkout-dash']);
  }

}
