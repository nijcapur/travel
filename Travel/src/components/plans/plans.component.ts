import { Component, OnInit, Input, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { MenuModel } from 'src/models/menu-model';
import { CommonInputs } from '../common-inputs';
import { Subscription, Observable, of } from 'rxjs';
import { PlansService } from './plans.service';
import { PlanDetail } from './plan-detail.model';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import * as _ from 'lodash';
import { PlanModel } from 'src/controls/plan-block/plan-model';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { IFrameComponent } from 'src/controls/iframe/iframe.component';
import { IFrameDialogComponent } from 'src/controls/iframe-dialog/iframe-dialog.component';

@Component({
  selector: 'rs-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent extends CommonInputs implements OnInit, OnDestroy {
  @Input() menuItem: MenuModel = null;
  public isMobile = false;
  public loading = false;
  public planDetails: PlanDetail = null;
  public planModels: Array<PlanModel> = new Array<PlanModel>();
  public planModels$: Observable<Array<PlanModel>> = null;
  public myPlanModels: Array<PlanModel> = new Array<PlanModel>();
  public myPlanModels$: Observable<Array<PlanModel>> = null;
  public headerPlanModel: PlanModel = new PlanModel();
  public myHeaderPlanModel: PlanModel = new PlanModel();
  public subs: Array<Subscription> = new Array<Subscription>();
  public showMyPlans = false;
  constructor(public plansService: PlansService, public googleSheetsService: GoogleSheetsService,
              private cdRef: ChangeDetectorRef, public dialog: MatDialog,
              public deviceService: DeviceDetectorService) {
    super();
  }

  ngOnInit(): void {
    this.getPlanDetails();
    this.isMobile = this.deviceService.isMobile() || window.innerWidth <= 1024;
  }

  private getPlanDetails() {
    this.loading = true;
    this.plansService.getPlanDetails(this.menuItem.fileInfo).subscribe((planDetail: PlanDetail) => {
      this.planDetails = planDetail;
      this.googleSheetsService.getSheetData(planDetail.spreadSheetId, planDetail.sheetName).subscribe((data) => {
        _.forEach(data.values, (row, index) => {
          const planModel: PlanModel = new PlanModel();
          planModel.id = row[0];
          planModel.name = row[1];
          planModel.displayName = row[2];
          planModel.price = row[3];
          planModel.description = row[4];
          planModel.imageUrl = row[5];
          planModel.videoUrl = row[6];
          if (index === 0) {
            this.headerPlanModel = planModel;
          } else {
            this.planModels.push(planModel);
          }
        });
        this.loading = false;
        this.planModels$ = of(this.planModels);
      });
    });
  }

  public getMyPlanDetails() {
    this.loading = true;
    this.myPlanModels = new Array<PlanModel>();
    this.googleSheetsService.getSheetData(this.planDetails.mySpreadSheetId, this.planDetails.mySheetName).subscribe((data) => {
      _.forEach(data.values, (row, index) => {
        if ((this.googleSheetsService.user.email === row[0] && this.planDetails.type === row[9]) || index === 0) {
          const planModel: PlanModel = new PlanModel();
          planModel.userEmail = row[0];
          planModel.name = row[1];
          planModel.displayName = row[2];
          planModel.price = row[3];
          planModel.description = row[4];
          planModel.imageUrl = row[5];
          planModel.publishedUrl = row[6];
          planModel.spreadSheetId = row[7];
          planModel.sheetName = row[8];
          planModel.videoUrl = row[10];
          if (index === 0) {
            this.myHeaderPlanModel = planModel;
          } else {
            this.myPlanModels.push(planModel);
          }
        }

      });
      this.loading = false;
      this.myPlanModels$ = of(this.myPlanModels);
    });
  }

  public togglePlan() {
    this.showMyPlans = !this.showMyPlans;
    this.loading = false;
  }

  public openDialog(plan: PlanModel) {
    const dialogRef = this.dialog.open(IFrameDialogComponent, {
      data: {
        scrUrl: plan.publishedUrl
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  public openImageDialog(plan: PlanModel) {
    const dialogRef = this.dialog.open(IFrameDialogComponent, {
      data: {
        scrUrl: plan.videoUrl
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
