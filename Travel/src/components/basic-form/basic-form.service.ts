import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicFormDetails } from './basic-form.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BasicFormService {
    constructor(private http: HttpClient) { }

    public getBasicFormDetails(filePath: string): Observable<BasicFormDetails> {
        const relFilePath = `/assets/${filePath}`;
        return this.http.get(relFilePath)
            .pipe(
                map((res: any) => {
                   const basciPlanDetails = new BasicFormDetails();
                   basciPlanDetails.spreadSheetId = res.SpreadSheetId;
                   basciPlanDetails.sheetName = res.SheetName;
                   return basciPlanDetails;
                })
            );
    }
}
