package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.OrderDetail;
import com.example.Seafood_Restaurant.exception.AppException;
import com.example.Seafood_Restaurant.exception.ErrorCode;
import com.example.Seafood_Restaurant.repository.OrderDetailRepository;
import com.example.Seafood_Restaurant.utils.OrderDetailStatus;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor //Dùng để tự động tạo constructor với tham số từ final field
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderDetailService {
    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Transactional
    public void updateOrderDetailStatus(long id, OrderDetailStatus status) {
        OrderDetail orderDetail = orderDetailRepository.findById(id).orElseThrow(() -> new RuntimeException("Order detail not found"));

        // Nếu đã hoàn thành hoặc hủy thì không cho phép cập nhật lại
        if (orderDetail.getStatus().equals(OrderDetailStatus.FINISHED.getValue()) || orderDetail.getStatus().equals(OrderDetailStatus.CANCELLED.getValue())) {
            throw new AppException(ErrorCode.ORDERDETAIL_CANCEL_REJECTED);
        }
        // Nếu đã được nấu thì không cho phép cập nhật lại
        if (status == OrderDetailStatus.CANCELLED && orderDetail.getStatus().equals(OrderDetailStatus.COOKING.getValue())) {
            throw new AppException(ErrorCode.ORDERDETAIL_CANCEL_REJECTED);
        }

        orderDetail.setStatus(status.getValue());
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
