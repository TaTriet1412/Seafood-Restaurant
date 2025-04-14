package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.ApiRespone;
import com.example.Seafood_Restaurant.dto.request.UpdateOrderDetailStatusRequest;
import com.example.Seafood_Restaurant.dto.response.GetOrderDetailRespone;
import com.example.Seafood_Restaurant.dto.response.UpdateOrderDetailStatusRespone;
import com.example.Seafood_Restaurant.entity.OrderDetail;
import com.example.Seafood_Restaurant.service.OrderDetailService;
import com.example.Seafood_Restaurant.utils.OrderDetailStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RestController
@RequestMapping("/order-detail")
@Validated
public class OrderDetailController {
    @Autowired
    OrderDetailService orderDetailService;

//    //endpoint để kiểm tra xem đã gọi được OrderDetailController chưa
//    @GetMapping("/check")
//    public String check() {
//        return "OrderDetailController is working";
//    }
//
//    // endpoint để lấy order detail theo id
//    @GetMapping("/{id}")
//    public ApiRespone<GetOrderDetailRespone> getOrderDetail(@PathVariable("id") long id) {
//        ApiRespone<GetOrderDetailRespone> apiRespone = new ApiRespone<>();
//
//        OrderDetail orderDetail = orderDetailService.getOrderDetail(id);
//
//        apiRespone.setResult(GetOrderDetailRespone.builder()
//                .id(orderDetail.getId())
//                .orderId(orderDetail.getOrder().getId())
//                .dishId(orderDetail.getDish().getId())
//                .quantity(orderDetail.getQuantity())
//                .price(orderDetail.getPrice())
//                .status(orderDetail.getStatus())
//                .build());
//
//        apiRespone.setMessage("Get order detail successfully");
//
//        return apiRespone;
//    }

    // endpoint để bếp chuyển trạng thái món về lại thành chưa nấu
//    @PutMapping("/ordered")
//    public ResponseEntity<UpdateOrderDetailStatusRespone> ordered(@RequestBody UpdateOrderDetailStatusRequest request) {
//
//        orderDetailService.updateOrderDetailStatus(request.getId(),OrderDetailStatus.ORDERED);
//
//        return ResponseEntity.ok( UpdateOrderDetailStatusRespone.builder()
//                .id(request.getId())
//                .status(orderDetailService.getOrderDetailStatus(request.getId()))
//                .build());
//    }

    // endpoint để bếp trạng thái món thành đang nấu
//    @PutMapping("/cooking")
//    public ApiRespone<UpdateOrderDetailStatusRespone> preparing(@RequestBody UpdateOrderDetailStatusRequest request) {
//        ApiRespone<UpdateOrderDetailStatusRespone> apiRespone = new ApiRespone<>();
//
//        orderDetailService.updateOrderDetailStatus(request.getId(),OrderDetailStatus.COOKING);
//
//
//        apiRespone.setResult(UpdateOrderDetailStatusRespone.builder()
//                .id(request.getId())
//                .status(orderDetailService.getOrderDetailStatus(request.getId()))
//                .build());
//
//        apiRespone.setMessage("Update status successfully");
//
//        return apiRespone;
//    }

    // endpoint để phục vụ hủy món (bếp chưa bắt đầu nấu)
//    @PutMapping("/cancelled")
//    public ApiRespone<UpdateOrderDetailStatusRespone> cancelled(@RequestBody UpdateOrderDetailStatusRequest request) {
//        ApiRespone<UpdateOrderDetailStatusRespone> apiRespone = new ApiRespone<>();
//
//        orderDetailService.updateOrderDetailStatus(request.getId(), request.getUserId(),OrderDetailStatus.CANCELLED);
//
//        apiRespone.setResult(UpdateOrderDetailStatusRespone.builder()
//                .id(request.getId())
//                .status(orderDetailService.getOrderDetailStatus(request.getId()))
//                .build());
//
//        apiRespone.setMessage("Update status successfully");
//
//        return apiRespone;
//    }

    // endpoint để bếp thông báo món đã nấu xong
    @PutMapping("/finished")
    public ResponseEntity<UpdateOrderDetailStatusRespone> finished(@Valid @RequestBody UpdateOrderDetailStatusRequest request) {
        orderDetailService.updateOrderDetailStatus(request.getId(),OrderDetailStatus.FINISHED);

        return ResponseEntity.ok( UpdateOrderDetailStatusRespone.builder()
                .id(request.getId())
                .status(orderDetailService.getOrderDetailStatus(request.getId()))
                .build());
    }
}
