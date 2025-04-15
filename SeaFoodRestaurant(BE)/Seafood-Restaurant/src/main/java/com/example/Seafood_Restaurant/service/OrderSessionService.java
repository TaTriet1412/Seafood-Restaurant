package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.dto.response.*;
import com.example.Seafood_Restaurant.entity.*;
import com.example.Seafood_Restaurant.repository.OrderSessionRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSessionService {
    @Autowired
    OrderSessionRepository orderSessionRepository;
    @Autowired
    @Lazy
    TableService tableService;
    @Autowired
    @Lazy
    ShiftService shiftService;

    public OrderSession getOrderSessionById(Long id) {
        return orderSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiên hóa đơn id = " + id));
    }

    public List<OrderSessionRes> getOrderSessionInProcessOrOrdered() {
        List<String> statuses = List.of("In Progress", "Ordered");
        List<OrderSession> sessions = orderSessionRepository.findByStatusInOrderByCreatedAtAsc(statuses);

        List<OrderSessionRes> result = new ArrayList<>();

        for (OrderSession session : sessions) {
            OrderSessionRes res = new OrderSessionRes(
                    session.getId(),
                    session.getTable().getId(),
                    session.getStatus(),
                    session.getCreatedAt()
            );
            result.add(res);
        }

        return result;
    }


    public DetailOrderSessionRes getDetailOrderSession(Long id) {
        OrderSession orderSession = getOrderSessionById(id);
        List<OrderDetail> orderDetails = new ArrayList<>();
        for(Order o:orderSession.getOrders()) {
            orderDetails.addAll(o.getOrderDetails());
        }

        List<OrderDetailDTO> orderDetailDTOs = orderDetails.stream()
                .map(OrderDetailDTO::fromEntity)
                .toList();

        return new DetailOrderSessionRes(id, orderSession.getTable().getId(), orderDetailDTOs,orderSession.getStatus());

    }

    public void handlePaymentOrderSession(
            LocalDateTime paymentLocalDateTime,
            Long orderSessionId,
            OrderSession orderSession
    ) {
        orderSession.setPaymentTime(paymentLocalDateTime);
        orderSession.setStatus("Completed");
        orderSession.setShift(shiftService.getCurrentShift());

        List<Order> orders = orderSession.getOrders();
        if (!orders.isEmpty()) {
            Order lastOrder = orders.get(orders.size() - 1);

            // Tạo log mới và thêm vào orderLogs (giả sử là danh sách)
            OrderLog newLog = new OrderLog();
            newLog.setMessage("Thanh toán thành công hóa đơn id = " + orderSessionId);
            newLog.setCreatedAt(paymentLocalDateTime);
            newLog.setOrder(lastOrder); // nếu có quan hệ ngược
            lastOrder.getOrderLogs().add(newLog);
        }


//        RestaurantTable table = tableService.getTableByOrderSessionId(orderSessionId);
//        table.setCurrentOrderSessionId(null);
//        tableService.saveTable(table);
        orderSessionRepository.save(orderSession);
    }

    public OrderSession createNewOrderSession(Long tableId) {
        OrderSession orderSession = new OrderSession();
        orderSession.setTable(tableService.getTableById(tableId));
        orderSession.setShift(shiftService.getCurrentShift());
        return orderSessionRepository.save(orderSession);
    }

    public OrderSession updateOrderSession(OrderSession o) {
        return orderSessionRepository.save(o);
    }

    public void updateAllStatusFromOrderedToCooking(Long orderSessionId) {
        OrderSession orderSession = getOrderSessionById(orderSessionId);
        // Get the last Order in the OrderSession
        Order lastOrder = orderSession.getOrders().getLast();
        boolean statusChanged = false;

        for (Order order : orderSession.getOrders()) {
            for (OrderDetail detail : order.getOrderDetails()) {
                if ("Ordered".equals(detail.getStatus())) {
                    detail.setStatus("Cooking");
                    statusChanged = true;
                }
            }
        }

        if (statusChanged) {
            OrderLog orderLog = OrderLog.builder()
                    .order(lastOrder) // Associate the log with the last order
                    .message("Bếp bắt đầu nấu.")
                    .createdAt(LocalDateTime.now())
                    .build();

            if (lastOrder.getOrderLogs() == null) {
                lastOrder.setOrderLogs(new ArrayList<>());
            }

            // Add the new log entry for the last order
            lastOrder.getOrderLogs().add(orderLog);
        }

        orderSession.setStatus("In Progress");

        orderSessionRepository.save(orderSession);
    }

    public Page<BillRes> getOrderSessions(String keyword, Integer year, Integer month, Integer day, Pageable pageable) {
        Page<OrderSession> orderSessionPage;

        // Prepare keyword (handle null/empty if necessary for your query logic)
        String searchKeyword = (keyword == null || keyword.trim().isEmpty()) ? null : keyword;

        // Decide which repository method to call based on filters
        boolean hasFilters = searchKeyword != null || year != null || month != null || day != null;

        if (hasFilters) {
            // Pass the Pageable object directly to the repository method
            orderSessionPage = orderSessionRepository.searchWithFilters(searchKeyword, year, month, day, pageable);
        } else {
            // Pass the Pageable object directly to findAll
            orderSessionPage = orderSessionRepository.findAll(pageable);
        }

        // Map the results
        return orderSessionPage.map(this::mapToRes);
    }

    public Page<BillRes> getOrderSessionsByShift(LocalDate date, String shift, Pageable pageable) {
        LocalDateTime startTime;
        LocalDateTime endTime;

        // Define shift times (adjust seconds/nanos if needed for exact boundaries)
        final LocalTime SHIFT_A_START = LocalTime.of(6, 0, 0);
        final LocalTime SHIFT_A_END = LocalTime.of(14, 0, 0); // Exclusive end for A (start of B)
        final LocalTime SHIFT_B_START = LocalTime.of(14, 0, 0);
        final LocalTime SHIFT_B_END = LocalTime.of(22, 0, 0); // Exclusive end for B
        final LocalTime SHIFT_C_START = LocalTime.of(22, 0, 0);
        final LocalTime SHIFT_C_END = LocalTime.of(6, 0, 0); // Exclusive end for C (next day's morning)

        if ("a".equalsIgnoreCase(shift)) {
            startTime = LocalDateTime.of(date, SHIFT_A_START);
            endTime = LocalDateTime.of(date, SHIFT_A_END);
        } else if ("b".equalsIgnoreCase(shift)) {
            startTime = LocalDateTime.of(date, SHIFT_B_START);
            endTime = LocalDateTime.of(date, SHIFT_B_END);
        } else if ("c".equalsIgnoreCase(shift)) {
            startTime = LocalDateTime.of(date, SHIFT_C_START);
            endTime = LocalDateTime.of(date.plusDays(1), SHIFT_C_END);
        } else {
            // If shift is null, empty, or invalid, return results for the entire working period of the day
            startTime = LocalDateTime.of(date, SHIFT_A_START); // From the start of the first shift
            endTime = LocalDateTime.of(date.plusDays(1), SHIFT_C_END);   // To the end of the last shift
        }

        Page<OrderSession> orderSessionPage = orderSessionRepository.findByPaymentTimeBetweenAndPaymentTimeIsNotNull(startTime, endTime, pageable);

        return orderSessionPage.map(this::mapToRes);
    }

    // Your mapping function - Ensure it uses correct getters from OrderSession ENTITY
    private BillRes mapToRes(OrderSession os) {
        // Assuming OrderSession entity has these getters (likely camelCase)
        return new BillRes(
                os.getId(),
                os.getStatus(),
                os.getTotalPrice(),        // Check if OrderSession entity has getTotal() returning BigInteger
                os.getPaymentTime(),  // Use os.getPaymentTime()
                os.getCreatedAt()     // Use os.getCreatedAt()
        );
    }

    public BillBaseRes getOveralBill(Long id) {
        OrderSession o = getOrderSessionById(id);

        return new BillBaseRes(
                o.getTable().getId(),
                o.getTotalPrice(),
                o.getPaymentTime(),
                o.getCreatedAt(),
                o.getStatus()
        );
    }


    public List<BillBaseResList> getBillsForTablesWithOrderSessions() {
        List<RestaurantTable> tableList = tableService.getAllTableOrderByIdAsc();
        List<BillBaseResList> result = new ArrayList<>();
        for (RestaurantTable table : tableList) {
            if (table.getCurrentOrderSessionId() != null) {
                OrderSession orderSession = getOrderSessionById(table.getCurrentOrderSessionId());
                result.add(new BillBaseResList(
                        orderSession.getTable().getId(),
                        orderSession.getTotalPrice(),
                        orderSession.getPaymentTime(),
                        orderSession.getCreatedAt(),
                        orderSession.getStatus()
                ));
            }
        }
        return result;
    }


    public List<Order> getAllOrderByOrderSessionId(Long id) {
        OrderSession orderSession = getOrderSessionById(id);
        return orderSession.getOrders().stream()
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<OrderLog> getListOrderLogByOrderSessionId(Long id) {
        OrderSession o = getOrderSessionById(id);
        return o.getOrders().stream()
                .flatMap(order -> order.getOrderLogs().stream())
                .collect(Collectors.toList());
    }

}
