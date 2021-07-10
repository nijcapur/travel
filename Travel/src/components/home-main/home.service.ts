import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Home } from './home';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    constructor(private http: HttpClient) { }

    public getHomeDetails(filePath: string): Observable<Home> {
        const relFilePath = `/assets/${filePath}`;
        return this.http.get(relFilePath)
            .pipe(
                map((res: any) => {
                   const home = new Home();
                   home.imagesPath = _.split(res.images, ';');
                   home.homeHtml = res.homeHtml;
                   return home;
                })
            );
    }
}
