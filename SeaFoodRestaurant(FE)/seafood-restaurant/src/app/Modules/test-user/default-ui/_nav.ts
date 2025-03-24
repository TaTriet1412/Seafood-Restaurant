import { INavData } from "@coreui/angular";

const BASE_PATH = '/test-user';

function prefixUrl(url: string): string {
  // Don't prefix external URLs or empty URLs
  if (!url || url.startsWith('http') || url.startsWith(BASE_PATH)) {
    return url;
  }
  return `${BASE_PATH}${url}`;
}

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: prefixUrl('/dashboard'),
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: prefixUrl('/theme/colors'),
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: prefixUrl('/theme/typography'),
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: prefixUrl('/base'),
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: prefixUrl('/base/accordion'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: prefixUrl('/base/breadcrumbs'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cards',
        url: prefixUrl('/base/cards'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carousel',
        url: prefixUrl('/base/carousel'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Collapse',
        url: prefixUrl('/base/collapse'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'List Group',
        url: prefixUrl('/base/list-group'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Navs & Tabs',
        url: prefixUrl('/base/navs'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Pagination',
        url: prefixUrl('/base/pagination'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Placeholder',
        url: prefixUrl('/base/placeholder'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Popovers',
        url: prefixUrl('/base/popovers'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Progress',
        url: prefixUrl('/base/progress'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Spinners',
        url: prefixUrl('/base/spinners'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tables',
        url: prefixUrl('/base/tables'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tabs',
        url: prefixUrl('/base/tabs'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tooltips',
        url: prefixUrl('/base/tooltips'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Buttons',
    url: prefixUrl('/buttons'),
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: prefixUrl('/buttons/buttons'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Button groups',
        url: prefixUrl('/buttons/button-groups'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Dropdowns',
        url: prefixUrl('/buttons/dropdowns'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Forms',
    url: prefixUrl('/forms'),
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Form Control',
        url: prefixUrl('/forms/form-control'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Select',
        url: prefixUrl('/forms/select'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Checks & Radios',
        url: prefixUrl('/forms/checks-radios'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Range',
        url: prefixUrl('/forms/range'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Input Group',
        url: prefixUrl('/forms/input-group'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Floating Labels',
        url: prefixUrl('/forms/floating-labels'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Layout',
        url: prefixUrl('/forms/layout'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Validation',
        url: prefixUrl('/forms/validation'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Charts',
    iconComponent: { name: 'cil-chart-pie' },
    url: prefixUrl('/charts')
  },
  {
    name: 'Icons',
    iconComponent: { name: 'cil-star' },
    url: prefixUrl('/icons'),
    children: [
      {
        name: 'CoreUI Free',
        url: prefixUrl('/icons/coreui-icons'),
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: prefixUrl('/icons/flags'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'CoreUI Brands',
        url: prefixUrl('/icons/brands'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Notifications',
    url: prefixUrl('/notifications'),
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: prefixUrl('/notifications/alerts'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Badges',
        url: prefixUrl('/notifications/badges'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Modal',
        url: prefixUrl('/notifications/modal'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Toast',
        url: prefixUrl('/notifications/toasts'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Widgets',
    url: prefixUrl('/widgets'),
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: prefixUrl('/login'),
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: prefixUrl('/login'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: prefixUrl('/register'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: prefixUrl('/404'),
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: prefixUrl('/500'),
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/', // External URL remains unchanged
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];