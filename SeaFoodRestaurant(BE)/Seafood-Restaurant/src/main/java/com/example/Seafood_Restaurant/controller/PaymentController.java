package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.entity.OrderSession;
import com.example.Seafood_Restaurant.entity.RestaurantTable;
import com.example.Seafood_Restaurant.repository.OrderSessionRepository;
import com.example.Seafood_Restaurant.service.OrderSessionService;
import com.example.Seafood_Restaurant.service.TableService;
import com.example.Seafood_Restaurant.service.payment.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/payments")
@Controller
public class PaymentController {
    @Autowired
    private VnPayService vnPayService;
    @Autowired
    private OrderSessionRepository orderSessionRepository;
    @Autowired
    @Lazy
    private TableService tableService;
    @Autowired
    @Lazy
    private OrderSessionService orderSessionService;

    @GetMapping("")
    public String home(){
        return "index";
    }


    @PostMapping("/vnpay")
    public ResponseEntity<Map<String, String>> submidOrder(
            @RequestParam("amount") int orderTotal,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam("orderSessionId") Long orderSessionId,
            @RequestParam("detailUrl") String detailUrl,
            HttpServletRequest request) {
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + "4200" + detailUrl;
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl, orderSessionId);

        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", vnpayUrl);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/afterPayed")
    public ResponseEntity<Object> afterPayment(HttpServletRequest request) throws Exception {
        // Lấy kết quả thanh toán từ dịch vụ (có thể trả về trạng thái giao dịch)
        int paymentStatus = vnPayService.orderReturn(request);


        // Lấy các tham số trả về từ cổng thanh toán (VNPAY)
        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
        String vnp_CardType = request.getParameter("vnp_CardType");

        // Tách orderSessionId từ vnp_TxnRef (giả sử vnp_TxnRef có dạng "orderSessionId-transactionId")
        String orderSessionId = vnp_TxnRef.split("-")[0];
        totalPrice = totalPrice.substring(0,totalPrice.length()-2);


        // Lấy đối tượng người dùng
        OrderSession orderSession = orderSessionRepository.findById(Long.parseLong(orderSessionId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có id : " + orderSessionId));

        // Lưu thời gian thanh toán
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        LocalDateTime paymentLocalDateTime = LocalDateTime.parse(paymentTime, formatter);

        orderSessionService.handlePaymentOrderSession(
                paymentLocalDateTime,
                Long.valueOf(orderSessionId),
                orderSession
        );



        // Xử lý theo kết quả trả về của cổng thanh toán
        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công, trả về ResponseEntity với thông báo thành công
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Thanh toán thành công!");
            response.put("orderSessionId", orderSessionId);
            response.put("orderId", orderInfo);
            response.put("totalPrice",  totalPrice);
            response.put("paymentTime", paymentTime);
            response.put("transactionId", transactionId);

            // Trả về mã trạng thái 200 OK và dữ liệu JSON
            return ResponseEntity.ok(response);
        } else {
            // Thanh toán thất bại, ném ngoại lệ và trả về lỗi với mã 400
            throw new RuntimeException("Thanh toán thất bại với mã phản hồi: " + vnp_ResponseCode);
        }
    }

}