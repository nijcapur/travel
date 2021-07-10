import { MenuModel } from 'src/models/menu-model';
import { Input } from '@angular/core';

export class CommonInputs {
    @Input() menuItem: MenuModel = null;
}
