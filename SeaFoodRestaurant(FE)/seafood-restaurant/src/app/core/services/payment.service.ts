import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/seafood_restaurant/payments';
  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  payByVnPay(
    amount: number, 
    orderInfo: string, 
    orderSessionId: number,
    rebackUrl: string, //url trở về trang sau khi thanh toán xong
  ): Observable<{ redirectUrl: string }> {
    const token = this.authService.getToken();  // Lấy JWT từ AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const formData: FormData = new FormData();
    formData.append('amount', amount.toString());
    formData.append('orderInfo', orderInfo);
    formData.append('detailUrl', rebackUrl);
    formData.append('orderSessionId', orderSessionId.toString());

    return this.http.post<{ redirectUrl: string }>(`${this.apiUrl}/vnpay`,
      formData, { headers });
  }

  sendPaymentResult(paymentDetails: any): Observable<any> {
    // Tạo HttpParams từ đối tượng paymentDetails
    let params = new HttpParams();
    for (const key in paymentDetails) {
      if (paymentDetails.hasOwnProperty(key)) {
        params = params.append(key, paymentDetails[key]);
      }
    }

    // Gửi GET request với các tham số
    const token = this.authService.getToken();  // Lấy JWT từ AuthService
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/afterPayed`, { params, headers });
  }
}
