package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.ValidateSecretCodeReq;
import com.example.Seafood_Restaurant.service.SecretCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/secret-code")
public class SecretCodeController {

    @Autowired
    private SecretCodeService secretCodeService;

    @GetMapping("/generate")
    public ResponseEntity<?> generateSecretCode() {
        // Gọi Service để tạo và trả về mã bí mật
        return ResponseEntity.ok(secretCodeService.generateAndSaveSecretCode());
    }
    @PostMapping("/validate")
    public ResponseEntity<?> validateSecretCode(@RequestBody ValidateSecretCodeReq req) {
        return ResponseEntity.ok(secretCodeService.validateSecretCode(req));
    }
}