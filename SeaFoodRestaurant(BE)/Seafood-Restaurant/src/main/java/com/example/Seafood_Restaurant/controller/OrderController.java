package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.CreateOrder;
import com.example.Seafood_Restaurant.dto.response.DetailOrderSessionRes;
import com.example.Seafood_Restaurant.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RestController
@RequestMapping("/order")
@Validated
public class OrderController {
    @Autowired
    OrderService orderService;

    @PostMapping
    public ResponseEntity<DetailOrderSessionRes> handleNewOrder(@Valid @RequestBody CreateOrder req) {
        return ResponseEntity.ok(orderService.handleNewOrder(req));
    }

}
