export interface Notification {
    id: number; // Changed from BIGINT to number for TS
    role_id?: number | null;
    user_id?: number | null;
    message: string;
    status: boolean; // 0 (false) = Unread, 1 (true) = Read
    notification_type: string;
    related_id?: number | null;
    created_at: string; // Or Date object if you parse it
}