import { OrderDetail } from "./order_detail";

export interface Order {
  status: string;
  tableId: number;
  orderSessionId: number;
  orderDetails: OrderDetail[];
}