import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs'; // Import 'of' for mock data
import { Notification } from '../../share/dto/response/notification-response';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    // --- Mock Data (Replace with actual API calls) ---
    private mockNotifications: Notification[] = [
        { id: 1, message: 'Đơn hàng mới #123 vừa được tạo.', status: false, notification_type: 'Order', created_at: new Date(Date.now() - 60000 * 5).toISOString(), related_id: 123 },
        { id: 2, message: 'Bàn 5 yêu cầu dịch vụ.', status: false, notification_type: 'Service', created_at: new Date(Date.now() - 60000 * 15).toISOString(), related_id: 5 },
        { id: 3, message: 'Hết hàng: Cà chua.', status: true, notification_type: 'Stock', created_at: new Date(Date.now() - 60000 * 60 * 2).toISOString() },
        { id: 4, message: 'Bảo trì hệ thống lúc 2 giờ sáng.', status: false, notification_type: 'System', created_at: new Date(Date.now() - 60000 * 60 * 24).toISOString() },
        { id: 5, message: 'Đơn hàng #122 đã hoàn thành.', status: true, notification_type: 'Order', created_at: new Date(Date.now() - 60000 * 60 * 25).toISOString(), related_id: 122 },
        { id: 6, message: 'Bàn 2 cần thanh toán.', status: false, notification_type: 'Payment', created_at: new Date(Date.now() - 60000 * 10).toISOString(), related_id: 2 },
        { id: 7, message: 'Cập nhật menu thành công.', status: true, notification_type: 'System', created_at: new Date(Date.now() - 60000 * 120).toISOString() },
    ];
    // --- End Mock Data ---

    getNotifications(): Observable<Notification[]> {
        // TODO: Replace with actual API call
        // const userId = this.authService.getUserId(); // Get user ID if filtering server-side
        // return this.http.get<Notification[]>(`${this.apiUrl}?userId=${userId}`);
        console.log('Fetching mock notifications');
        // Simulate API delay
        return of(this.mockNotifications).pipe(tap(() => console.log('Mock notifications returned')));

    }

    markAsRead(notificationId: number): Observable<any> {
        // TODO: Replace with actual API call (e.g., PATCH)
        // return this.http.patch(`${this.apiUrl}/${notificationId}/read`, {});
        console.log(`Marking mock notification ${notificationId} as read`);
        const index = this.mockNotifications.findIndex(n => n.id === notificationId);
        if (index > -1) {
            this.mockNotifications[index].status = true;
        }
        // Simulate API delay
        return of({ success: true }).pipe(tap(() => console.log('Mock notification marked as read')));
    }

    // Optional: Endpoint to get only the count
    getUnreadCount(): Observable<number> {
        // TODO: Replace with actual optimized API call if needed
        // return this.http.get<number>(`${this.apiUrl}/unread-count`);
        const unreadCount = this.mockNotifications.filter(n => !n.status).length;
        console.log(`Getting mock unread count: ${unreadCount}`);
        return of(unreadCount);
    }
}