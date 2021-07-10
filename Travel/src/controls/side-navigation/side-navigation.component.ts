import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { MenuModel } from 'src/models/menu-model';
import { HostContentDirective } from 'src/directives/host-content.directive';
import { CommonInputs } from 'src/components/common-inputs';

@Component({
  selector: 'rs-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {
  @Input() menuItems: Array<MenuModel> = null;
  @ViewChild(HostContentDirective, {static: true}) content: HostContentDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  public hideContent = false;
  ngOnInit(): void {
  }

  public itemClicked(item: MenuModel) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(item.component);
    const viewContainerRef = this.content.viewContainerRef;
    viewContainerRef.clear();
    this.hideContent = true;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (componentRef.instance as CommonInputs).menuItem = item;
  }

}
