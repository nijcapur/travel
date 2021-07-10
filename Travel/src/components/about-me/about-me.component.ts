import { Component, OnInit, Input, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { MenuModel } from 'src/models/menu-model';
import { CommonInputs } from '../common-inputs';
import { AboutMe } from './about-me.model';
import { Observable, Subscription, of } from 'rxjs';
import { AboutMeService } from './about-me.service';
import * as _ from 'lodash';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'rs-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent extends CommonInputs implements OnInit, OnDestroy  {
  @Input() menuItem: MenuModel = null;
  public isMobile = false;
  public subs: Array<Subscription> = new Array<Subscription>();
  public aboutMe: AboutMe = new AboutMe();
  public images$: Observable<Array<string>> = null;
  public videos$: Observable<Array<string>> = null;

  constructor(private aboutMeService: AboutMeService,
              private cdRef: ChangeDetectorRef,
              public deviceService: DeviceDetectorService) {
    super();
  }

  ngOnInit(): void {
    this.getAboutMeDetails();
    this.isMobile = this.deviceService.isMobile() || window.innerWidth <= 1024;
  }

  private getAboutMeDetails() {
    this.aboutMeService.getAboutMeDetails(this.menuItem.fileInfo).subscribe((aboutMe) => {
        this.images$ = of(aboutMe.imagesPath);
        this.videos$ = of(aboutMe.videoUrls);
        this.aboutMe = aboutMe;
    });
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
