package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.User;
import com.example.Seafood_Restaurant.exception.SimpleHttpException;
import com.example.Seafood_Restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new SimpleHttpException(HttpStatus.NOT_FOUND, "Không tìm thấy user có id = " + id));
    }

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        for (User user: getUsers()) {
            if(user.getEmail().equals(email)) return user;
        }
        throw  new SimpleHttpException(HttpStatus.NOT_FOUND,"Không tồn tại email này!");
    }

    public boolean existsByEmail(String email) {
        for(User user:getUsers()) {
            if(user.getEmail().equals(email)) {
                return true;
            }
        }
        return false;
    }

    public boolean existsByPhone(String phone) {
        for(User user:getUsers()) {
            if(user.getPhone().equals(phone)) {
                return true;
            }
        }
        return false;
    }
}
