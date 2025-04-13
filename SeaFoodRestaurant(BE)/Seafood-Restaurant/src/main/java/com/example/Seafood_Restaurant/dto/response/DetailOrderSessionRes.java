package com.example.Seafood_Restaurant.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailOrderSessionRes {
    Long orderSessionId;
    Long tableId;
    List<OrderDetailDTO> orderDetails;
    String status;
}
