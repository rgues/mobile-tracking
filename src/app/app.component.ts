import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './shared/service/local-storage.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/services/auth.service';
import { UiService } from './shared/service/ui.service';
import { EventService } from './shared/service/events.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  menuItens:any;
  activePath:string;
  isAuth: boolean;
  constructor(
    private translate: TranslateService,
    private menu: MenuController,
    private localStorage: LocalStorageService,
    private ui: UiService,
    private auth: AuthService,
    private event: EventService,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private router: Router
  ) {
    this.localStorage.setItem('startRefreshToken', 'false');
    this.activePath = this.router.url;
    this.initializeApp();
    this.setDefaultLang();
    this.ui.hardwareBackButton();
    this.auth.getOrganisationsInfos();
    this.disableMenu();
    this.setMenusItems();
    this.isAuth = this.auth.getToken() ? true: false;
    this.event.subscribe('has-login', () => {
      this.isAuth = this.auth.getToken() ? true: false;
      this.setMenusItems();
    });
  }

  // Initialize the app
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  // set the default language
  setDefaultLang() {
    this.translate.setDefaultLang('fr');
    this.translate.use('fr');
  }


  // logout
  logout() {
    this.closeMenu();
    this.auth.logoutMember();
    this.isAuth = false;
    this.setMenusItems();
    this.translate.get('LOGOUT_MSG').subscribe(trans => {
        this.ui.presentToast(trans);
    });
  }

   // close menu
   disableMenu() {
    this.menu.enable(true);
  }

  // close menu
  closeMenu() {
    this.menu.close();
  }

  // set the menu items
  setMenusItems() {
    this.menuItens = [];
    this.translate.get([
      'AIR_FREIGHT',
      'SEA_FREIGHT',
      'LIST_PACKAGE',
      'NOTIFY_CLIENT',
      'CHECKOUT_PACKAGE_TEXT',
      'CONTACT_TEXT',
      'LOGIN_TEXT',
      'CHECK_PAGES_TEXT'
    ]).subscribe(trans => {
      this.menuItens.push({ path: `/home/save-package-air`,icon: 'airplane-outline',canshow: this.isAuth , title: trans.AIR_FREIGHT });
      this.menuItens.push({ path: `/home/save-package-sea`,icon: 'boat-outline', canshow: this.isAuth, title: trans.SEA_FREIGHT });
      this.menuItens.push({ path: `/home/list-package`,icon: 'reorder-four-outline', canshow: this.isAuth, title: trans.LIST_PACKAGE });
      this.menuItens.push({ path: `/home/scan-dash`,icon: 'mail-outline', canshow: this.isAuth,title: trans.NOTIFY_CLIENT });
      this.menuItens.push({ path: `/home/checkout-dash`,icon: 'checkmark-done-outline', canshow: this.isAuth,title: trans.CHECKOUT_PACKAGE_TEXT });
      this.menuItens.push({ path: `/home/customer-listing`,icon: 'list-outline', canshow: true, title: trans.CHECK_PAGES_TEXT });
      this.menuItens.push({ path: `/auth/login`,icon: 'log-in-outline', canshow:!this.isAuth, title: trans.LOGIN_TEXT });
      this.menuItens.push({ path: `/auth/contact`,icon: 'call-outline',canshow:true, title: trans.CONTACT_TEXT });

    });
  }



}
