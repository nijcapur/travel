import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AboutMe } from './about-me.model';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class AboutMeService {
    constructor(private http: HttpClient) { }

    public getAboutMeDetails(filePath: string): Observable<AboutMe> {
        const relFilePath = `/assets/${filePath}`;
        return this.http.get(relFilePath)
            .pipe(
                map((res: any) => {
                   const aboutMe = new AboutMe();
                   aboutMe.imagesPath = _.split(res.images, ';');
                   aboutMe.videoUrls = _.split(res.videos, ';');
                   aboutMe.aboutMeHtml = res.aboutMeHtml;
                   aboutMe.showImages = res.showImages;
                   return aboutMe;
                })
            );
    }
}
