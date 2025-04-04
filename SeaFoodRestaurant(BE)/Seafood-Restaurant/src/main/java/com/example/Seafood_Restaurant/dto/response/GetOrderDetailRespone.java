package com.example.Seafood_Restaurant.dto.response;

import com.example.Seafood_Restaurant.entity.Dish;
import com.example.Seafood_Restaurant.entity.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class GetOrderDetailRespone {
    Long id;
    long orderId;
    long dishId;
    Integer quantity;
    BigDecimal price; // Price at the time of ordering
    String status;
    String note;
}
