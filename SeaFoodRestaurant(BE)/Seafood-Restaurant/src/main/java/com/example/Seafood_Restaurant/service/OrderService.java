package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.dto.request.CreateOrder;
import com.example.Seafood_Restaurant.dto.request.DetailOrderRequest;
import com.example.Seafood_Restaurant.dto.response.DetailOrderSessionRes;
import com.example.Seafood_Restaurant.dto.response.OrderDetailDTO;
import com.example.Seafood_Restaurant.entity.*;
import com.example.Seafood_Restaurant.exception.SimpleHttpException;
import com.example.Seafood_Restaurant.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderService {
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    @Lazy
    OrderSessionService orderSessionService;
    @Autowired
    @Lazy
    TableService tableService;
    @Autowired
    @Lazy
    DishService dishService;
    @Autowired
    @Lazy
    ShiftService shiftService;


    @Transactional(rollbackOn = Exception.class)
    public DetailOrderSessionRes handleNewOrder(CreateOrder req) {
        boolean isNewCreated = false;

        OrderSession orderSession;
            if(req.orderSessionId() == -1) {
                orderSession = orderSessionService.createNewOrderSession(req.tableId());
                isNewCreated = true;
            }else {
                orderSession = orderSessionService.getOrderSessionById(req.orderSessionId());
//                Kiểm tra tableId của orderSession có đúng không
                if(!orderSession.getTable().getId().equals(req.tableId())) {
                    throw new SimpleHttpException(HttpStatus.BAD_REQUEST,"Dữ liệu tableId và orderSessionId không khớp");
                }

                orderSession.setShift(shiftService.getCurrentShift());
            }


            Order order = new Order();

            List<OrderDetail> orderDetailList = new ArrayList<>();

            if(req.items().isEmpty()) {
                throw new SimpleHttpException(HttpStatus.BAD_REQUEST,"Phải có ít nhất 1 món");
            }

            for (DetailOrderRequest detailItem : req.items()) {
                Dish dish = dishService.getDishById(detailItem.dishId());
                if(!dish.getAble()) throw new SimpleHttpException(HttpStatus.BAD_REQUEST, "Món ăn " + dish.getName() + " (id = " + dish.getId() + ") đã tắt"+". Vui lòng chọn món khác");
                OrderDetail orderDetail = OrderDetail.builder()
                        .order(order)
                        .dish(dish)
                        .quantity(detailItem.quantity())
                        .price(dish.getPrice())
                        .status("Ordered")
                        .build();
                orderDetailList.add(orderDetail);

                orderSession.setTotalPrice(orderSession.getTotalPrice().add(orderDetail.getPrice().multiply(BigInteger.valueOf(orderDetail.getQuantity())) ));
            }

            order.setOrderDetails(orderDetailList); // nếu có setOrderDetails
            order.setOrderSession(orderSession);
            order.setCreatedAt(LocalDateTime.now());
            order.setNote(req.note());
            OrderLog orderLog = OrderLog.builder()
                    .order(order) // Ensure the log is associated with the current order
                    .message("Thêm món mới" )
                    .createdAt(LocalDateTime.now())
                    .build();
            if (order.getOrderLogs() == null) {
                order.setOrderLogs(new ArrayList<>());
            }
            if(isNewCreated) {
                OrderLog orderLogNew = OrderLog.builder()
                        .order(order) // Ensure the log is associated with the current order
                        .message("Thêm phiên hóa đơn mới " )
                        .createdAt(LocalDateTime.now())
                        .build();
                order.getOrderLogs().add(orderLogNew);
            }
            order.getOrderLogs().add(orderLog);
            orderLog.setOrder(order);
            orderRepository.save(order);



            RestaurantTable table = tableService.getTableById(req.tableId());
            table.setCurrentOrderSessionId(orderSession.getId());
            tableService.saveTable(table);
            orderSession.setStatus("Ordered");
            orderSessionService.updateOrderSession(orderSession);

            List<OrderDetailDTO> orderDetailDTOs = orderDetailList.stream()
                    .map(OrderDetailDTO::fromEntity)
                    .toList();

            return new DetailOrderSessionRes(orderSession.getId(), req.tableId(), orderDetailDTOs, orderSession.getStatus());
    }
}
