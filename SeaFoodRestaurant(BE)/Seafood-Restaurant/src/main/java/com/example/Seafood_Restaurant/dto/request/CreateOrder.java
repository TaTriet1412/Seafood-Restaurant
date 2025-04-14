package com.example.Seafood_Restaurant.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrder(
        @NotNull(message = "tableId không được để trống")
        Long tableId,
        @NotNull(message = "orderSessionId không được để trống")
        Long orderSessionId,
        @NotNull(message = "Thiếu chi tiết hóa đơn (món ăn)")
        @Valid
        List<DetailOrderRequest> items,
        String note
) {
}
