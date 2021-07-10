import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlanDetail } from './plan-detail.model';

@Injectable({
    providedIn: 'root'
})
export class PlansService {
    constructor(private http: HttpClient) { }

    public getPlanDetails(filePath: string): Observable<PlanDetail> {
        const relFilePath = `/assets/${filePath}`;
        return this.http.get(relFilePath)
            .pipe(
                map((res: any) => {
                   const planDetail = new PlanDetail();
                   planDetail.spreadSheetId = res.SpreadSheetId;
                   planDetail.sheetName = res.SheetName;
                   planDetail.mySpreadSheetId = res.MySpreadSheetId;
                   planDetail.mySheetName = res.MySheetName;
                   planDetail.type = res.Type;
                   return planDetail;
                })
            );
    }
}
