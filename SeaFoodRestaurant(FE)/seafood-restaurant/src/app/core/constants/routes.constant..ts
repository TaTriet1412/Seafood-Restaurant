export const ROUTES = {
    HOME: {
        path: '',
        fullPath: ''
    },
    ADMIN: {
        path: 'admin',
        fullPath: '/admin',
        children: {
            TABLE: {
                path: 'tables',
                fullPath: '/admin/tables',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'admin/tables/list'
                    },
                    ORDER: {
                        path: ':id/table-order',
                        fullPath: (id: string) => 
                            `/admin/tables/${id}/table-order`,
                    },
                    BILL: {
                        path: ':id/table-bill',
                        fullPath: (id: string) =>
                            `/admin/tables/${id}/table-bill`
                    }
                }
            },
            MENU: {
                path: 'menu',
                fullPath: '/admin/menu',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'admin/menu/list'
                    }
                }
            },
            BILL: {
                path: 'bills',
                fullPath: '/admin/bills',
                children: {
                    SHIFT: {
                        path: 'shift',
                        fullPath: '/admin/bills/shift'
                    },
                    DATE: {
                        path: 'date',
                        fullPath: '/admin/bills/date'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `admin/bills/${id}`
                    }
                }
            }
        }
    },
    STAFF: {

    },
    CHEF: {

    }
}