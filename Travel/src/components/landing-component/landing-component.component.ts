import { Component, OnInit, OnDestroy } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginModel } from '../login/login-model';
import { LandingService } from './landing.service';
import { Subscription, Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';

@Component({
  selector: 'rs-landing',
  templateUrl: './landing-component.component.html',
  styleUrls: ['./landing-component.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  public subs: Array<Subscription> = new Array<Subscription>();
  constructor(public landingService: LandingService, private googleSheetsService: GoogleSheetsService) { }

  ngOnInit(): void {
    this.getUserLogInfo();
    this.landingService.checkIfUserAuthenticated().then((autenticated: boolean) => {
      if (autenticated) {
        this.googleSheetsService.user = this.googleSheetsService.authInstance.currentUser.get();
        console.log(this.googleSheetsService.user);
        this.landingService.reloadMenu();
      }
    });
  }

  public getUserLogInfo() {
    const sub: Subscription = this.landingService.getLoginDetails().subscribe((loginDetail: LoginModel) => {
      this.landingService.menuItems$ = of(loginDetail.menuItems);
    });
    this.subs.push(sub);
  }

  private unsubscribe(): void {
    _.forEach(this.subs, (sub: Subscription) => {
      sub.unsubscribe();
    });
    this.subs = new Array<Subscription>();
  }

  ngOnDestroy() {
      this.unsubscribe();
  }
}
