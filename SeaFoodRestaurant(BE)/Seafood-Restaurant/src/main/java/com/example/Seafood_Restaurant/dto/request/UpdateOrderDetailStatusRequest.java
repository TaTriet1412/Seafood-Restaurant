package com.example.Seafood_Restaurant.dto.request;

import com.example.Seafood_Restaurant.utils.OrderDetailStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.PRIVATE;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
public class UpdateOrderDetailStatusRequest {
    @NotNull(message = "id không được để trống")
    Long id;
}

