import { INavData } from "@coreui/angular";

const BASE_PATH = '/chef';

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
    name: 'Quản lý món ăn'
  },
  {
    name: "Danh sách món ăn",
    url: prefixUrl('/dishes'),
    iconComponent: {name: 'cil-fastfood'}
  },
  {
    title: true,
    name: 'Quản lý đơn hàng'
  },
  {
    name: "Danh sách đơn hàng",
    url: prefixUrl('/orders'),
    iconComponent: {name: 'cil-excerpt'}
  }
]
