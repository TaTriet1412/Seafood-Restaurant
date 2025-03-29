import { OrderDetail } from "./order_detail";

export interface Order {
  id: number;
  orderDetail: OrderDetail[];
}