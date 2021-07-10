import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostContentDirective } from './host-content.directive';



@NgModule({
  declarations: [HostContentDirective],
  imports: [
    CommonModule
  ],
  exports: [HostContentDirective]
})
export class DirectivesModule { }
