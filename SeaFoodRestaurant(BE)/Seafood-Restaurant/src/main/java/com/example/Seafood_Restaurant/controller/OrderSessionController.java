package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.response.*;
import com.example.Seafood_Restaurant.entity.Order;
import com.example.Seafood_Restaurant.entity.OrderLog;
import com.example.Seafood_Restaurant.service.OrderSessionService;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RestController
@RequestMapping("/order-session")
public class OrderSessionController {
    @Autowired
    OrderSessionService orderSessionService;

    Gson gson;

    @GetMapping("/{id}/details")
    public ResponseEntity<DetailOrderSessionRes> getDetailsOfOrderSession(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderSessionService.getDetailOrderSession(id));
    }

    @GetMapping("/in-progress-or-ordered")
    public ResponseEntity<List<OrderSessionRes>> getOrderSessionInProcessOrOrdered() {
        return ResponseEntity.ok(orderSessionService.getOrderSessionInProcessOrOrdered());
    }

    @PutMapping("/{id}/order-details/cooking")
    public ResponseEntity<?> updateAllStatusFromOrderedToCooking(
            @PathVariable Long id
    ) {
        orderSessionService.updateAllStatusFromOrderedToCooking(id);

        return ResponseEntity.ok(gson.toJson("Thay đổi tất cả món sang đang nấu"));
    }

    @GetMapping("/filter/shift")
    public ResponseEntity<Page<BillRes>> getOrderSessionsByShift(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, // Expect yyyy-MM-dd
            @RequestParam(required = false) String shift, // 'a', 'b', 'c' or null/empty for all shifts
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) { // Default size 10

        // Basic validation (optional, can add more)
        if (shift != null && !shift.isEmpty() && !shift.equalsIgnoreCase("a") && !shift.equalsIgnoreCase("b")) {
            // Handle invalid shift parameter if needed, e.g., return bad request or default to all shifts
            // For now, the service handles null/empty/invalid by defaulting to all shifts
        }

        Page<BillRes> result = orderSessionService.getOrderSessionsByShift(date, shift, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/filter/time")
    public Page<BillRes> getOrderSessions(
            // Keep specific filter parameters
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer day,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable // Keep this!
    ) {
        return orderSessionService.getOrderSessions(keyword, year, month, day, pageable);
    }

    @GetMapping("/{id}/bill/base")
    public ResponseEntity<BillBaseRes> getBillBaseRes(@PathVariable Long id) {
        return ResponseEntity.ok(orderSessionService.getOveralBill(id));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<OrderLog>> getOrderLogsByOrderSessionId(@PathVariable Long id) {
        return ResponseEntity.ok(orderSessionService.getListOrderLogByOrderSessionId(id));
    }
    
    @GetMapping("/{id}/all-order")
    public ResponseEntity<List<Order>> getAllOrderByOrderSessionId(@PathVariable Long id) {
        return ResponseEntity.ok(orderSessionService.getAllOrderByOrderSessionId(id));
    }

    @GetMapping("/exits-in-table/bill")
    public ResponseEntity<List<BillBaseResList>> getBillResInTable() {
        return ResponseEntity.ok(orderSessionService.getBillsForTablesWithOrderSessions());
    }
}