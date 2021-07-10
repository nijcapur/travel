import { Component, OnInit } from '@angular/core';
import { CommonInputs } from '../common-inputs';

@Component({
  selector: 'rs-admin',
  templateUrl: './admin-component.component.html',
  styleUrls: ['./admin-component.component.scss']
})
export class AdminComponent extends CommonInputs  implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }

}
