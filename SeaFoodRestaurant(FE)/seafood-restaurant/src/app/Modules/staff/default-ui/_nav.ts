import { INavData } from "@coreui/angular";

const BASE_PATH = '/staff';

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
    url: prefixUrl('/tables'),
    iconComponent: {name: 'cil-fire'}
  },
  {
    name: "Danh sách món ăn",
    url: prefixUrl('/menu'),
    iconComponent: {name: 'cil-fastfood'}
  }
]

