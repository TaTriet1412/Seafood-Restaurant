package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.User;
import com.example.Seafood_Restaurant.repository.UserRepository;
import com.example.Seafood_Restaurant.security.JwtTokenProvider;
import com.example.Seafood_Restaurant.utils.FieldUtils;
import com.example.Seafood_Restaurant.utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);



    public User tryLogin(String userId, String password) {
        // userId có thể là email hoặc số điện thoại
        for(User user:userService.getUsers()){
            if((user.getEmail().equals(userId) || user.getPhone().equals(userId)) &&
                    passwordEncoder.matches(password,user.getPassword())){
                user.setLast_login(LocalDateTime.now());
                userRepository.save(user);
                return user;
            }
        }
        throw new RuntimeException("Thông tin đăng nhập không chính xác");
    }

    public void encodePassword(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void encodeOldPassword(){
        List<User> userList = userService.getUsers();
        for(User user:userList){
            if (!user.getPassword().startsWith("$2a$") &&
                    !user.getPassword().startsWith("$2b$") &&
                    !user.getPassword().startsWith("$2y$")){
                encodePassword(user);
            }
        }
    }

    public void logout(String email) {
        User user = userService.getUserByEmail(email);
        jwtTokenProvider.logout(email);
        user.set_active(false);
        userRepository.save(user);
    }
}
