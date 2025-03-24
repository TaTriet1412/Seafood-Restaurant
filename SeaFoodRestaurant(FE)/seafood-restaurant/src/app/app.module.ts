import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from "ngx-spinner";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { SidebarModule } from '@coreui/angular';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import * as allIcons from '@coreui/icons'; // Import all icons
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    SidebarModule,

    IconModule, 
    IconSetModule,

  ],
  providers: [
    IconSetService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class AppModule { 
  constructor(private iconSet: IconSetService) {
    // Extract only the icons, excluding icon groups like brandSet, flagSet, etc.
    const icons = Object.keys(allIcons)
      .filter(key => key.startsWith('cil') || key.startsWith('cib') || key.startsWith('cis'))
      .reduce((acc, key) => {
        acc[key] = (allIcons as any)[key];
        return acc;
      }, {} as { [key: string]: string[] });

    this.iconSet.icons = icons; // Register only the valid icons
  }
}
