import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ConstantService } from 'src/app/shared/service/constant.service';
import { LocalStorageService } from 'src/app/shared/service/local-storage.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  organisation: any;
  loading: boolean;

  constructor(
    private localStorage: LocalStorageService,
    private navController: NavController,
    private router: Router
  ) {
      this.loading = false;
      this.organisation = this.localStorage.getItemSecure('organisation-data');
  }

  ngOnInit() {

  }

  // open the web site
  openWebsite(url: string) {
    window.open(url,'_blank');
  }

  // get the logo
  getLogo(url: string) {
     return `${ConstantService.baseUrlApiDev}${url}`
  }


  //go to home
  gotoHome() {
      this.navController.setDirection('root');
      this.router.navigate(['home']);
  }

}
