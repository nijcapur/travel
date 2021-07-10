import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuModel } from 'src/models/menu-model';
import { LoginModel } from '../login/login-model';
import * as _ from 'lodash';
import { GoogleSheetsService } from 'src/google-sheets/google-sheets.service';
import { AboutMeComponent } from '../about-me/about-me.component';
import { PlansComponent } from '../plans/plans.component';
import { MealPlansComponent } from '../meal-plans/meal-plans.component';
import { HomeComponent } from '../home/home.component';
import { AdminComponent } from '../admin-component/admin-component.component';
import { LoginComponent } from '../login/login.component';
import { BasicFormComponent } from '../basic-form/basic-form.component';

@Injectable({
    providedIn: 'root'
})
export class LandingService {
    public loginModel: LoginModel = new LoginModel();
    public loginModel$: Observable<LoginModel> = null;
    public menuItems$: Observable<Array<MenuModel>> = null;
    public menuItems: Array<MenuModel> = new Array<MenuModel>();
    public subs: Array<Subscription> = new Array<Subscription>();
    public componentNames = {
        HomeComponent,
        BasicFormComponent,
        AboutMeComponent,
        PlansComponent,
        LoginComponent,
        AdminComponent
    };
    constructor(private http: HttpClient, private googleSheetsService: GoogleSheetsService) { }

    public getLoginDetails(): Observable<any> {
        const loginPath = '/assets/userInfo/config.txt';
        return this.http.get(loginPath)
            .pipe(
                map((res: any) => {
                    this.menuItems = new Array<MenuModel>();
                    this.loginModel = new LoginModel();
                    this.loginModel.clientId = res.clientId;
                    this.loginModel.apiKey = res.apiKey;
                    this.googleSheetsService.apiKey = this.loginModel.apiKey;
                    this.loginModel.loginSpreadSheetId = res.spreadSheetId;
                    this.loginModel.loginSheetName = res.sheetName;
                    this.loginModel.menuItems = new Array<MenuModel>();
                    _.forEach(res.menuItems, (menuItem, index) => {
                        const menuModel: MenuModel = new MenuModel();
                        menuModel.id = index;
                        menuModel.title = (menuItem.component === 'HomeComponent' && !_.isNull(this.googleSheetsService.user)) ?
                                           'Log Out' : menuItem.title;
                        menuModel.fileInfo = menuItem.fileInfo;
                        menuModel.component = this.componentNames[menuItem.component];
                        this.menuItems.push(menuModel);
                        if (!_.isNull(this.googleSheetsService.user) && menuItem.component === 'AdminComponent'
                            && this.googleSheetsService.user.email === 'humblebeastsumir@gmail.com') {
                            this.loginModel.menuItems.push(menuModel);
                        } else if (_.isNull(this.googleSheetsService.user)) {
                            if (menuItem.component !== 'AdminComponent' &&
                                (menuItem.component === 'AboutMeComponent' || menuItem.component === 'HomeComponent'
                                    || menuItem.component === 'LoginComponent')) {
                                this.loginModel.menuItems.push(menuModel);
                            }
                        } else if (menuItem.component !== 'AdminComponent') {
                            this.loginModel.menuItems.push(menuModel);
                        }
                    });
                    return this.loginModel;
                })
            );
    }


    public reloadMenu() {
        const sub: Subscription = this.getLoginDetails().subscribe((loginDetail: LoginModel) => {
            this.loginModel$ = of(loginDetail);
            this.menuItems$ = of(loginDetail.menuItems);
        });
        this.subs.push(sub);
    }

    async initGoogleAuth(): Promise<void> {
        //  Create a new Promise where the resolve
        // function is the callback passed to gapi.load
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });
        // When the first promise resolves, it means we have gapi
        // loaded and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: this.loginModel.clientId, scope: this.googleSheetsService.SCOPES })
                // .init({ client_id: this.loginModel.clientId})
                .then(auth => {
                    this.googleSheetsService.gapiSetup = true;
                    this.googleSheetsService.authInstance = auth;
                });
        });
    }

    signOut() {
        gapi.auth2.getAuthInstance().disconnect();
        this.googleSheetsService.user = null;
        this.reloadMenu();
    }

    async authenticate(): Promise<gapi.auth2.GoogleUser> {
        // Initialize gapi if not done yet
        if (!this.googleSheetsService.gapiSetup) {
            await this.initGoogleAuth();
        }

        // Resolve or reject signin Promise
        return new Promise(async () => {
            await this.googleSheetsService.authInstance.signIn().then((user, error) => {
                this.googleSheetsService.user = user;
                this.googleSheetsService.user.email = user.getBasicProfile().getEmail();
                this.googleSheetsService.user.imageUrl = user.getBasicProfile().getImageUrl();
                this.googleSheetsService.user.name = user.getBasicProfile().getName();
                this.googleSheetsService.user.id = user.getBasicProfile().getId();
                this.googleSheetsService.error = error;
                gapi.load('client', (client) => {
                    gapi.client.load('sheets', 'v4').then((sheets) => {
                        const valueRangeBody = { values : [[this.googleSheetsService.user.name, this.googleSheetsService.user.email, '' ,
                                _.toString(new Date()) , _.toString(navigator.language), _.toString(navigator.language)]]
                                // TODO: Add desired properties to the request body. All existing properties
                                // will be replaced.
                            };
                        this.googleSheetsService.updateSheetData(this.loginModel.loginSpreadSheetId,
                            this.loginModel.loginSheetName, valueRangeBody).subscribe((data) => {
                                this.reloadMenu();
                            });
                    });
                });
            }
            );
        });
    }

    async checkIfUserAuthenticated(): Promise<boolean> {
        // Initialize gapi if not done yet
        if (!this.googleSheetsService.gapiSetup) {
            await this.initGoogleAuth();
        }

        return this.googleSheetsService.authInstance.isSignedIn.get();
    }
}
