import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { MenuModel } from 'src/models/menu-model';
import { Subscription, Observable, of } from 'rxjs';
import { AboutMeService } from '../about-me/about-me.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as _ from 'lodash';
import { Home } from './home';
import { HomeService } from './home.service';
import { IFrameDialogComponent } from 'src/controls/iframe-dialog/iframe-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'rs-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss']
})
export class HomeMainComponent implements OnInit, OnDestroy {

  public isMobile = false;
  public subs: Array<Subscription> = new Array<Subscription>();
  public home: Home = new Home();
  public images$: Observable<Array<string>> = null;
  public loading = false;

  constructor(private homeService: HomeService,
              public dialog: MatDialog,
              private cdRef: ChangeDetectorRef,
              public deviceService: DeviceDetectorService) {
  }

  ngOnInit(): void {
    this.getHomeDetails();
    this.isMobile = this.deviceService.isMobile() || window.innerWidth <= 1024;
  }

  private getHomeDetails() {
    this.loading = true;
    this.homeService.getHomeDetails('/userInfo/homeMainInfo.txt').subscribe((home) => {
        this.images$ = of(home.imagesPath);
        this.home = home;
        this.loading = false;
    });
  }

  public openDialog() {
    const dialogRef = this.dialog.open(IFrameDialogComponent, {
      data: {
        scrUrl: '/#/privacypolicy'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
