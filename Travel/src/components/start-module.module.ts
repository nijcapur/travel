import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, WavesModule } from 'angular-bootstrap-md';
import { LandingComponent } from './landing-component/landing-component.component';
import { ControlsModule } from 'src/controls/controls.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MealPlansComponent } from './meal-plans/meal-plans.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PlansComponent } from './plans/plans.component';
import { HomeComponent } from './home/home.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminComponent } from './admin-component/admin-component.component';
import { HomeMainComponent } from './home-main/home-main.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LandingComponent, LoginComponent, SignUpComponent, MealPlansComponent, AboutMeComponent,
    PlansComponent, HomeComponent, AdminComponent, HomeMainComponent, PrivacyPolicyComponent, BasicFormComponent],
  imports: [
    CommonModule, CarouselModule, WavesModule, ControlsModule, HttpClientModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule, FormsModule
  ],
  exports: [LandingComponent, AdminComponent, LoginComponent, HomeMainComponent, PrivacyPolicyComponent, BasicFormComponent],
  providers: [HttpClient, HttpClientModule, GoogleSheetsService]
})
export class StartModule { }
