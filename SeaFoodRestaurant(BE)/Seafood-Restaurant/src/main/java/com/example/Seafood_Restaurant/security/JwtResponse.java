package com.example.Seafood_Restaurant.security;

import com.example.Seafood_Restaurant.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {

    private String token;
    private String name;
    private String email;
    private String role;

    public JwtResponse(String token, User user) {
        this.token = token;
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().getName();
    }
}