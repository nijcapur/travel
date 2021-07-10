import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LandingService } from '../landing-component/landing.service';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import * as _ from 'lodash';
import { BasicFormDetails } from './basic-form.model';
import { BasicFormService } from './basic-form.service';
import { CommonInputs } from '../common-inputs';
import { LoginModel } from '../login/login-model';
@Component({
  selector: 'rs-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent extends CommonInputs implements OnInit {
  @Input() loginModel: LoginModel = null;
  @Input() isMobile = false;
  public form: FormGroup = null;
  public showSuccessMsg = false;
  public basicFormDetails: BasicFormDetails = null;
  constructor(public landingService: LandingService,
              private googleSheetsService: GoogleSheetsService,
              private fb: FormBuilder,
              private basicFormService: BasicFormService) { super(); }

  ngOnInit(): void {
    this.initForm();
    this.getBasicFormDetails();
  }

  public initForm() {
    this.form = this.fb.group({});
    this.form.addControl('emailid', new FormControl(_.toString(this.googleSheetsService.user.email), []));
    this.form.addControl('phonenumber', new FormControl(null, []));
    this.form.addControl('age', new FormControl(null, []));
    this.form.addControl('weight', new FormControl(null, []));
    this.form.addControl('height', new FormControl(null, []));
    this.form.addControl('activitylevel', new FormControl(null, []));
  }

  private getBasicFormDetails() {
    this.basicFormService.getBasicFormDetails('/userInfo/formInfo.txt').subscribe((basicFormDetails: BasicFormDetails) => {
      this.basicFormDetails = basicFormDetails;
    });
  }

  public submitForm() {
    const valueRangeBody = {
      values: [[_.toString(this.form.controls['emailid'].value), _.toString(this.form.controls['phonenumber'].value), 
      _.toString(this.form.controls['age'].value), _.toString(this.form.controls['weight'].value),
       _.toString(this.form.controls['height'].value), _.toString(this.form.controls['activitylevel'].value)]]
      // TODO: Add desired properties to the request body. All existing properties
      // will be replaced.
    };
    this.googleSheetsService.updateSheetData(this.basicFormDetails.spreadSheetId,
      this.basicFormDetails.sheetName, valueRangeBody).subscribe((data) => {
        this.showSuccessMsg = true;
      });
  }

}
