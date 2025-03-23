import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './default-ui/login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DefaultUiComponent } from './default-ui/default-ui.component';

@NgModule({
  declarations: [
    DefaultUiComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxSpinnerModule,

  ],
  exports: [NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule { }
