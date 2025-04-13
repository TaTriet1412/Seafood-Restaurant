export const ROUTES = {
    HOME: {
        path: '',
        fullPath: ''
    },
    USER: {
        path: 'user',
        fullPath: '/user',
        childer: {
            LOGIN: {
                path: 'login',
                fullPath: '/user/login'
            }
        }
    },
    ADMIN: {
        path: 'manager',
        fullPath: '/manager',
        children: {
            TABLE: {
                path: 'tables',
                fullPath: '/manager/tables',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/manager/tables/list'
                    },
                    ORDER: {
                        path: ':id/table-order',
                        fullPath: (id: string) =>
                            `/manager/tables/${id}/table-order`,
                    },
                    BILL: {
                        path: ':id/table-bill',
                        fullPath: (id: string) =>
                            `/manager/tables/${id}/table-bill`
                    }
                }
            },
            MENU: {
                path: 'menu',
                fullPath: '/manager/menu',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'manager/menu/list'
                    }
                }
            },
            BILL: {
                path: 'bills',
                fullPath: '/manager/bills',
                children: {
                    SHIFT: {
                        path: 'shift',
                        fullPath: '/manager/bills/shift'
                    },
                    DATE: {
                        path: 'date',
                        fullPath: '/manager/bills/date'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `manager/bills/${id}`
                    }
                }
            }
        }
    },
    STAFF: {
        path: 'staff',
        fullPath: '/staff',
        children: {
            TABLE: {
                path: 'tables',
                fullPath: '/staff/tables',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: '/staff/tables/list'
                    },
                    ORDER: {
                        path: ':id/table-order',
                        fullPath: (id: string) =>
                            `/staff/tables/${id}/table-order`,
                    },
                    BILL: {
                        path: ':id/table-bill',
                        fullPath: (id: string) =>
                            `/staff/tables/${id}/table-bill`
                    }
                }
            },
            MENU: {
                path: 'menu',
                fullPath: '/staff/menu',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'staff/menu/list'
                    }
                }
            },
        }
    },
    CHEF: {
        path: 'chef',
        fullPath: '/chef',
        children: {
            DISH: {
                path: 'dishes',
                fullPath: '/chef/dishes'
            },
            ORDER: {
                path: 'orders',
                fullPath: '/chef/orders',
                children: {
                    LIST: {
                        path: 'list',
                        fullPath: 'chef/orders/list'
                    },
                    DETAIL: {
                        path: ':id',
                        fullPath: (id: string) => `chef/orders/${id}`
                    }
                }
            }
        }
    }
}