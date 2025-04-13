export interface TableRes {
    id: number;
    currentOrderSessionId: number | null;
    paymentTime: Date | null; // Add this property
}