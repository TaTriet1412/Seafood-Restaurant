package com.example.Seafood_Restaurant.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderSessionRes {
    Long orderSessionId;
    Long tableId;
    String status;
    LocalDateTime createAt;
}
