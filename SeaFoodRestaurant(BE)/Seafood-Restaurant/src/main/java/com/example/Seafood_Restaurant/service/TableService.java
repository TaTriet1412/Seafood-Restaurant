package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.Order;
import com.example.Seafood_Restaurant.entity.OrderLog;
import com.example.Seafood_Restaurant.entity.OrderSession;
import com.example.Seafood_Restaurant.entity.RestaurantTable;
import com.example.Seafood_Restaurant.exception.SimpleHttpException;
import com.example.Seafood_Restaurant.repository.TableRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TableService {
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    @Lazy
    private OrderSessionService orderSessionService;
    

    public RestaurantTable getTableById(Long id) {
        return tableRepository.findById(id).orElseThrow(() ->
                new SimpleHttpException(HttpStatus.NOT_FOUND, "Không tìm thấy bàn có id = " + id)
        );
    }

    public List<RestaurantTable> getAllTableOrderByIdAsc() {
        return tableRepository.findAllByOrderByIdAsc();
    }

    public RestaurantTable getTableByOrderSessionId(Long sessionId) {
        return tableRepository.findByCurrentOrderSessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn với order session id: " + sessionId));
    }

    public void saveTable(RestaurantTable table) {
        tableRepository.save(table);
    }

    @Transactional
    public void offTable(Long tableId) {
        RestaurantTable table = getTableById(tableId);
        OrderSession orderSession = orderSessionService.getOrderSessionById(table.getCurrentOrderSessionId());
        List<Order> orders = orderSession.getOrders();
        if (!orders.isEmpty()) {
            Order lastOrder = orders.get(orders.size() - 1);

            // Tạo log mới và thêm vào orderLogs (giả sử là danh sách)
            OrderLog newLog = new OrderLog();
            newLog.setMessage("Khách ra về và nhân viên tắt bàn " + table.getId());
            newLog.setCreatedAt(LocalDateTime.now());
            newLog.setOrder(lastOrder); // nếu có quan hệ ngược
            lastOrder.getOrderLogs().add(newLog);
        }

        orderSessionService.updateOrderSession(orderSession);
        table.setCurrentOrderSessionId(null);
        tableRepository.save(table);
    }

}
