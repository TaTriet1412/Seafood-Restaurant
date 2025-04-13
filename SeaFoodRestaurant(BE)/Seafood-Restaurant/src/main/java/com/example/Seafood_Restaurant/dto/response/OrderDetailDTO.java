package com.example.Seafood_Restaurant.dto.response;

import com.example.Seafood_Restaurant.entity.OrderDetail;

import java.math.BigInteger;

public record OrderDetailDTO(
        Long id,
        Long dishId,
        String dishName,
        Integer quantity,
        BigInteger price,
        String status
) {
    public static OrderDetailDTO fromEntity(OrderDetail detail) {
        return new OrderDetailDTO(
                detail.getId(),
                detail.getDish().getId(),
                detail.getDish().getName(),
                detail.getQuantity(),
                detail.getPrice(),
                detail.getStatus()
        );
    }
}