package com.example.Seafood_Restaurant.dto.request;

public record DetailOrderRequest(
        Long dishId,
        Integer quantity
) {
}
