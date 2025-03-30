import { Component } from '@angular/core';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
} from '@coreui/angular';
import { DefaultFooterComponent } from './default-footer/default-footer.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { navItems } from './_nav';

import { NgScrollbar } from 'ngx-scrollbar';
import { SidebarModule } from '@coreui/angular-pro';

@Component({
  selector: 'app-default-ui',
  standalone: true,
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective,
  ],
  templateUrl: './default-ui.component.html',
  styleUrl: './default-ui.component.scss'
})
export class DefaultUiComponent {
  public navItems = [...navItems];

}
