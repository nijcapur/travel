import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { MaterialModule } from 'src/material-module/material-module.module';
import { DirectivesModule } from 'src/directives/directives.module';
import { IFrameComponent } from './iframe/iframe.component';
import { PlanBlockComponent } from './plan-block/plan-block.component';
import { IFrameDialogComponent } from './iframe-dialog/iframe-dialog.component';



@NgModule({
  declarations: [SideNavigationComponent, IFrameComponent, PlanBlockComponent, IFrameDialogComponent],
  imports: [
    CommonModule, MaterialModule, DirectivesModule
  ],
  exports: [
    SideNavigationComponent, PlanBlockComponent, IFrameComponent, IFrameDialogComponent
  ]
})
export class ControlsModule { }
