import { MenuModel } from 'src/models/menu-model';

export class LoginModel {
    public clientId: string = null;
    public clientSecret: string = null;
    public apiKey: string = null;
    public loginSpreadSheetId: string  = null;
    public loginSheetName: string  = null;
    public menuItems: Array<MenuModel> = null;
}