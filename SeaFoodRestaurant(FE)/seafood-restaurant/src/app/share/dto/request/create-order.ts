import { DetailOrderReq } from "./detail-order-req";

export interface CreateOrder {
    tableId: number;
    orderSessionId: number,
    note: string,
    items: DetailOrderReq[]
}