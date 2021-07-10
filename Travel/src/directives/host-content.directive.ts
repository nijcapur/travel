import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[host-content]'
})
export class HostContentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
