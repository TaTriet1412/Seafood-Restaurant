package com.example.Seafood_Restaurant.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DetailOrderRequest(
        @NotNull(message = "dishId không được để trống")
        Long dishId,

        @NotNull(message = "quantity không được để trống")
        @Positive(message = "Số lượng phải là số nguyên > 0")
        Integer quantity
) {
}
