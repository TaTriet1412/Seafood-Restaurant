import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { DefaultUiComponent } from './default-ui/default-ui.component';
import { MenuItemsComponent } from './views/menu/menu-items/menu-items.component';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    DefaultUiComponent
  ],
  exports: [
    DefaultUiComponent
  ]
})
export class StaffModule { }
