export interface OrderDetail {
    id: number;
    name: string;
    quantity: number;
    price: number;
    total: string;
    status: string;
    _props: { color: string; align: string };
}