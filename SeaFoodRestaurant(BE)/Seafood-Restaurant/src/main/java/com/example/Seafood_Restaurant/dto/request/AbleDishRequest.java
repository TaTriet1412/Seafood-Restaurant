package com.example.Seafood_Restaurant.dto.request;


import jakarta.validation.constraints.NotNull;

public record AbleDishRequest(
        @NotNull(message = "dishId không được để trống")
        Long dishId
) {}
