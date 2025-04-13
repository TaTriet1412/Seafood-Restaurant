package com.example.Seafood_Restaurant.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BillBaseResList {
    Long tableId;
    BigInteger totalPrice;
    LocalDateTime paymentTime;
    LocalDateTime createdAt;
    String status;
}