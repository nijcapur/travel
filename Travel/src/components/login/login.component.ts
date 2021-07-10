import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { LoginModel } from './login-model';
import { LandingService } from '../landing-component/landing.service';
import { of, Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'rs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @Input() loginModel: LoginModel = null;
  @Input() isMobile = false;
  public subs: Array<Subscription> = new Array<Subscription>();

  constructor(public googleSheetsService: GoogleSheetsService,
              public landingService: LandingService) { }

  ngOnInit() {
    this.getUserLogInfo();
    this.landingService.checkIfUserAuthenticated().then((autenticated: boolean) => {
      if (autenticated) {
        const user = this.googleSheetsService.authInstance.currentUser.get();
        this.googleSheetsService.user = user;
        this.googleSheetsService.user.email = user.getBasicProfile().getEmail();
        this.googleSheetsService.user.imageUrl = user.getBasicProfile().getImageUrl();
        this.googleSheetsService.user.name = user.getBasicProfile().getName();
        this.googleSheetsService.user.id = user.getBasicProfile().getId();
        // this.googleSheetsService.user = this.googleSheetsService.authInstance.currentUser.get();
        console.log(this.googleSheetsService.user);
        this.landingService.reloadMenu();
        gapi.load('client', (client) => {
          gapi.client.load('sheets', 'v4').then((sheets) => {
          });
        });
      }
    });
  }

  public getUserLogInfo() {
    const sub: Subscription = this.landingService.getLoginDetails().subscribe((loginDetail: LoginModel) => {
      this.loginModel = loginDetail;
    });
    this.subs.push(sub);
  }

  // private reloadMenu() {
  //   const sub: Subscription = this.landingService.getLoginDetails().subscribe((loginDetail: LoginModel) => {
  //     this.landingService.loginModel$ = of(loginDetail);
  //     this.landingService.menuItems$ = of(loginDetail.menuItems);
  //   });
  //   this.subs.push(sub);
  // }

  // async initGoogleAuth(): Promise<void> {
  //   //  Create a new Promise where the resolve
  //   // function is the callback passed to gapi.load
  //   const pload = new Promise((resolve) => {
  //     gapi.load('auth2', resolve);
  //   });
  //   // When the first promise resolves, it means we have gapi
  //   // loaded and that we can call gapi.init
  //   return pload.then(async () => {
  //     await gapi.auth2
  //       .init({ client_id: this.loginModel.clientId, scope: this.googleSheetsService.SCOPES })
  //       // .init({ client_id: this.loginModel.clientId})
  //       .then(auth => {
  //         this.googleSheetsService.gapiSetup = true;
  //         this.googleSheetsService.authInstance = auth;
  //       });
  //   });
  // }

  // signOut() {
  //   gapi.auth2.getAuthInstance().disconnect();
  //   this.googleSheetsService.user = null;
  //   this.reloadMenu();
  // }

  // async authenticate(): Promise<gapi.auth2.GoogleUser> {
  //   // Initialize gapi if not done yet
  //   if (!this.googleSheetsService.gapiSetup) {
  //     await this.initGoogleAuth();
  //   }

  //   // Resolve or reject signin Promise
  //   return new Promise(async () => {
  //     await this.googleSheetsService.authInstance.signIn().then((user, error) => {
  //       this.googleSheetsService.user = user;
  //       this.googleSheetsService.error = error;
  //       gapi.load('client', (client) => {
  //         gapi.client.load('sheets', 'v4').then((sheets) => {
  //           this.googleSheetsService.updateSheetData(this.loginModel.loginSpreadSheetId,
  //             this.loginModel.loginSheetName).subscribe((data) => {
  //               this.reloadMenu();
  //             });
  //         });
  //       });
  //     }
  //     );
  //   });
  // }

  // async checkIfUserAuthenticated(): Promise<boolean> {
  //   // Initialize gapi if not done yet
  //   if (!this.googleSheetsService.gapiSetup) {
  //     await this.initGoogleAuth();
  //   }

  //   return this.googleSheetsService.authInstance.isSignedIn.get();
  // }

  private unsubscribe(): void {
    _.forEach(this.subs, (sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subs = new Array<Subscription>();
    _.forEach(this.landingService.subs, (sub: Subscription) => {
      sub.unsubscribe();
    });
    this.landingService.subs = new Array<Subscription>();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
