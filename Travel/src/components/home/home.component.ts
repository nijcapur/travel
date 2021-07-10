import { Component, OnInit, Input, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { LoginModel } from '../login/login-model';
import { LandingService } from '../landing-component/landing.service';
import { MenuModel } from 'src/models/menu-model';
import { CommonInputs } from '../common-inputs';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'rs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends CommonInputs implements OnInit, OnDestroy {
  @Input() menuItem: MenuModel = null;
  public loading = false;
  public isMobile = false;
  public subs: Array<Subscription> = new Array<Subscription>();
  constructor(public deviceService: DeviceDetectorService, private cdRef: ChangeDetectorRef, public landingService: LandingService) {
    super();
  }

  ngOnInit(): void {
    this.getUserLogInfo();
    this.isMobile = this.deviceService.isMobile() || window.innerWidth <= 1024;
  }

  public getUserLogInfo() {
    this.loading = true;
    const sub: Subscription = this.landingService.getLoginDetails().subscribe((loginDetail: LoginModel) => {
      this.landingService.loginModel$ = of(loginDetail);
      this.loading = false;
    });
    this.subs.push(sub);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isMobile = window.innerWidth <= 1024;
    this.cdRef.detectChanges();
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
