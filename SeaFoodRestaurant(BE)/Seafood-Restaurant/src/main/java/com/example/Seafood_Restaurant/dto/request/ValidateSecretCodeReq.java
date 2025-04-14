package com.example.Seafood_Restaurant.dto.request;

import jakarta.validation.constraints.NotNull;

public record ValidateSecretCodeReq (
        @NotNull(message = "secretCode không được null")
        String secretCode
) {
}
