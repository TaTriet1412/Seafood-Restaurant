package com.example.Seafood_Restaurant.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    @NotEmpty(message = "Email  không được để trống")
    private String email;
}
