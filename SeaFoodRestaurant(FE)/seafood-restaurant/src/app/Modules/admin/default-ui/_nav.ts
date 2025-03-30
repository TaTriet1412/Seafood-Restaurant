import { INavData } from "@coreui/angular";
import { ROUTES } from "../../../core/constants/routes.constant.";

const BASE_PATH = '/admin';

function prefixUrl(url: string): string {
  // Don't prefix external URLs or empty URLs
  if (!url || url.startsWith('http') || url.startsWith(BASE_PATH)) {
    return url;
  }
  return `${BASE_PATH}${url}`;
}

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Quản lý bàn ăn'
  },
  {
    name: "Danh sách bàn ăn",
    url: ROUTES.ADMIN.children.TABLE.fullPath,
    iconComponent: {name: 'cil-fire'}
  },
  {
    name: "Danh sách món ăn",
    url: ROUTES.ADMIN.children.MENU.fullPath,
    iconComponent: {name: 'cil-fastfood'}
  },
  {
    title: true,
    name: 'Quản lý phiếu tính tiền'
  },
  {
    name: 'Phiếu tính tiền',
    url: ROUTES.ADMIN.children.BILL.fullPath,
    iconComponent: {name: 'cil-library'},
    children: [
      {
        name: 'Theo ca trực',
        url: ROUTES.ADMIN.children.BILL.children.SHIFT.fullPath,
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Theo năm/ tháng/ ngày',
        url: ROUTES.ADMIN.children.BILL.children.DATE.fullPath,
        icon: 'nav-icon-bullet'
      }
    ]
  }
]
