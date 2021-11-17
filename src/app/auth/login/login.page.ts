import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/shared/service/error.service';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from 'src/app/shared/service/ui.service';
import { AuthService } from '../services/auth.service';
import { AuthErrorService } from '../services/auth-error.service';
import { EventService } from 'src/app/shared/service/events.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formData: FormGroup;
  loadingForm: boolean;
  validationMessages: any;
  canShow: boolean;

  constructor(
    private fb: FormBuilder,
    private authservice: AuthService,
    private translate: TranslateService,
    private nav : NavController,
    private authError: AuthErrorService,
    private error: ErrorService,
    private router: Router,
    private event: EventService,
    private ui: UiService
  ) {
    this.loadingForm = false;
    this.canShow = false;
  }

  ngOnInit() {
    this.initUserLogin();
    this.initFormMessage();
  }

  // Getters
  get email() {
    return this.formData.get('email');
  }

  get password() {
    return this.formData.get('password');
  }

  // Init the form message
  initFormMessage() {
    this.translate
      .get([
        'ERROR_FIELD_REQUIRED_MSG',
        'ERROR_FIELD_EMAIL_REQUIRED_MSG',
      ])
      .subscribe((value) => {
        this.validationMessages = {
          email: [
            { type: 'pattern', message: value.ERROR_FIELD_EMAIL_REQUIRED_MSG },
          ],
          password: [
            { type: 'required', message: value.ERROR_FIELD_REQUIRED_MSG },
          ],
        };
      });
  }

  // Init login form
  initUserLogin() {
    this.formData = this.fb.group({
      email: ['',Validators.pattern('^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}[.][a-z]{2,4}$')],
      password: ['', Validators.compose([Validators.required])],
    });
  }

  // update the type
  updateType() {
    this.canShow = !this.canShow;
  }

  // Log in the user
  auth(data: any) {
    this.loadingForm = true;
    this.translate.get('CONNEXION_TEXT').subscribe((trans) => {
      this.ui.presentLoading(trans);
    });
    const credentials = {
      email: data.email,
      password:data.password
    };
    this.authservice.authentication(data).subscribe(
      (reponse: any) => {
        this.loadingForm = false;
        this.ui.dismissLoading();
        if (reponse && reponse.message === 'success') {
          this.authservice.setToken(reponse.token);
          this.authservice.setData(reponse.user);
          this.authservice.setCredentials(credentials);
          this.event.publish('has-login');
          this.translate.get('LOGIN_MSG').subscribe(trans => {
            this.ui.presentToast(trans);
          });
          this.nav.setDirection('root');
          this.router.navigate(['home']);
        }
      },
      (error) => {
        this.loadingForm = false;
        this.ui.dismissLoading();
        if (error && error.error && error.error.message === 'error') {
          this.authError.manageAuthError(error);
        } else {
          this.error.manageError(error);
        }
      }
    );
  }
}
