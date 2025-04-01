package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.LoginRequest;
import com.example.Seafood_Restaurant.dto.request.LogoutRequest;
import com.example.Seafood_Restaurant.entity.User;
import com.example.Seafood_Restaurant.security.JwtResponse;
import com.example.Seafood_Restaurant.security.JwtTokenProvider;
import com.example.Seafood_Restaurant.service.AuthService;
import com.google.gson.Gson;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private AuthService authService;
    private final Gson gson;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Trả về lỗi nếu có lỗi xác thực
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        // Generate JWT token
        User account = authService.tryLogin(loginRequest.getUserId(),loginRequest.getPassword());
        String jwtToken = jwtTokenProvider.generateToken(account);

        // Return the JWT token along with user details (or just the token if preferred)
        return ResponseEntity.ok(new JwtResponse(jwtToken,account));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest logoutDTO) {
        authService.logout(logoutDTO.getEmail());
        return ResponseEntity.ok(gson.toJson("Đăng xuất thành công"));
    }

}
