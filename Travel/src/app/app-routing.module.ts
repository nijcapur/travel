import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from 'src/components/landing-component/landing-component.component';
import { HomeMainComponent } from 'src/components/home-main/home-main.component';
import { PrivacyPolicyComponent } from 'src/components/privacy-policy/privacy-policy.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';


const routes: Routes = [{
  path: '', pathMatch: 'full', redirectTo: 'home'
},
{
  path: 'plans', component: LandingComponent
},
{
  path: 'home', component: HomeMainComponent
},
{
  path: 'privacypolicy', component: PrivacyPolicyComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
