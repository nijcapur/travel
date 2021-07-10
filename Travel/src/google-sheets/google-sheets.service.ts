import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class GoogleSheetsService {
    public authInstance: any = null;
    public gapiSetup: any = null;
    public user: any = null;
    public apiKey: string = null;
    public error: any = null;
    // public SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/spreadsheets.readonly'];
    public SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
    constructor(public http: HttpClient) {}

    public getSheetData(sheetID: string, sheetName: string): Observable<any> {
        const bearerToken = this.user.wc.access_token;
        const contentType = 'application/json;charset=UTF-8';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${this.apiKey}`;
        // const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/od6/public/values?alt=json`;
        return this.http.get(url, { headers: new HttpHeaders()
            .set('Authorization', 'Bearer ' + bearerToken)
            .set('Content-Type', contentType),
            responseType: 'json',
           })
          .pipe(
            map((res: any) => {
                return res;
            })
          );
      }

      public updateSheetData(sheetID: string, sheetName: string, valueRangeBody: any): Observable<any> {
        const params = {
            // The ID of the spreadsheet to update.
            spreadsheetId: sheetID,  // TODO: Update placeholder value.
            // The A1 notation of the values to update.
            range: sheetName,  // TODO: Update placeholder value.
            // How the input data should be interpreted.
            valueInputOption: 'RAW',  // TODO: Update placeholder value.
          };
        // const valueRangeBody = { values : [[this.user.Qt.Bd, this.user.Qt.Au, '' ,
        //                         _.toString(new Date()) , _.toString(navigator.language), _.toString(navigator.language)]]
        //     // TODO: Add desired properties to the request body. All existing properties
        //     // will be replaced.
        //   };
        const request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
        request.then((response) => {
            // TODO: Change code below to process the `response` object:
          }, (reason) => {
            console.error('error: ' + reason.result.error.message);
          });
        return of(true);
      }
}
