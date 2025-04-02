import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SidebarModule } from '@coreui/angular';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import * as allIcons from '@coreui/icons'; // Import all icons
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { IMAGE_CONFIG } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,

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
    IconSetService,
    provideClientHydration(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true, 
        disableImageLazyLoadWarning: true
      }
    },
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
