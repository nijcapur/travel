import { Component, OnInit, Input, Output } from '@angular/core';
import { PlanModel } from './plan-model';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'rs-plan-block',
  templateUrl: './plan-block.component.html',
  styleUrls: ['./plan-block.component.scss']
})
export class PlanBlockComponent implements OnInit {
  @Input() planBlock: PlanModel = null;
  @Output() clickEvent = new EventEmitter();
  @Output() imageClicked = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  public onClick(event) {
    this.clickEvent.emit(event);
  }

  public imageClick(event) {
    this.imageClicked.emit(event);
  }

}
