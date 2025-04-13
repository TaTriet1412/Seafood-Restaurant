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
import java.math.BigInteger;

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
    BigInteger price;
    String status;
    String note;
}
