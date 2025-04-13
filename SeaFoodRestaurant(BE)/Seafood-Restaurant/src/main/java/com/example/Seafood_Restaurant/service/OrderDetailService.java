package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.OrderDetail;
import com.example.Seafood_Restaurant.entity.OrderLog;
import com.example.Seafood_Restaurant.entity.OrderSession;
import com.example.Seafood_Restaurant.exception.AppException;
import com.example.Seafood_Restaurant.exception.ErrorCode;
import com.example.Seafood_Restaurant.repository.OrderDetailRepository;
import com.example.Seafood_Restaurant.utils.OrderDetailStatus;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor //Dùng để tự động tạo constructor với tham số từ final field
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderDetailService {
    @Autowired
    OrderDetailRepository orderDetailRepository;
    @Autowired
    @Lazy
    OrderSessionService orderSessionService;


    @Transactional
    public void updateOrderDetailStatus(Long id, OrderDetailStatus status) {
        OrderDetail orderDetail = orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order detail not found"));

        // Nếu đã hoàn thành hoặc hủy thì không cho phép cập nhật lại
        if (orderDetail.getStatus().equals(OrderDetailStatus.FINISHED.getValue()) ) {
            throw new AppException(ErrorCode.ORDERDETAIL_CANCEL_REJECTED);
        }
        orderDetail.setStatus(status.getValue());


        if(status.equals(OrderDetailStatus.FINISHED)) {
            OrderLog orderLog = OrderLog.builder()
                    .order(orderDetail.getOrder()) // Ensure the log is associated with the current order
                    .message("Hoàn thành món " + orderDetail.getDish().getName()
                            + " với số lượng " + orderDetail.getQuantity()
                    )
                    .createdAt(LocalDateTime.now())
                    .build();
            orderDetail.getOrder().getOrderLogs().add(orderLog);
        }

        OrderSession orderSession = orderDetail.getOrder().getOrderSession();

        boolean allFinished = orderSession.getOrders().stream()
                .flatMap(order -> order.getOrderDetails().stream())
                .allMatch(od -> od.getStatus().equals(OrderDetailStatus.FINISHED.getValue()));

        if (allFinished) {
            orderSession.setStatus("Ready To Pay");

            orderSessionService.updateOrderSession(orderSession);
        } else {
            orderSession.setStatus("In Progress");
            orderSessionService.updateOrderSession(orderSession);
        }
        orderDetailRepository.save(orderDetail);
    }

    // Lấy status của order detail
    public String getOrderDetailStatus(long id) {
        return orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order detail not found")).getStatus();
    }

    // Lấy order detail theo id
    public OrderDetail getOrderDetail(long id) {
        return orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order detail not found"));
    }
}
