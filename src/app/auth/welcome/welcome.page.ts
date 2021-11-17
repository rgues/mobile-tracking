import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from 'src/app/shared/service/constant.service';
import { UiService } from 'src/app/shared/service/ui.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  organisation: any;
  loading: boolean;

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private navController: NavController,
    private router: Router,
    private ui: UiService
  ) {
      this.loading = true;
      this.organisation = null;
  }

  ngOnInit() {
    this.getOrganisationData();
  }

  // Get the organisation data
  getOrganisationData() {

    this.auth.getOrganisationsInfos().subscribe(data => {

       if (data) {
        this.organisation = data;
        this.loading = false;
        this.gotoHome();
       } else {
         // failid to load the application data
         this.translate.get(['LOAD_DATA_FAILED_MSG']).subscribe(trans => {
            this.ui.presentAlert('',trans.LOAD_DATA_FAILED_MSG);
         });
       }
    });
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
