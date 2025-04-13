package com.example.Seafood_Restaurant.dto.request;

import java.util.List;

public record CreateOrder(
        Long tableId,
        Long orderSessionId,
        List<DetailOrderRequest> items,
        String note
) {
}
