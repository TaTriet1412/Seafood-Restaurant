package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.entity.Dish;
import com.example.Seafood_Restaurant.service.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/dish")
public class DishController {
    @Autowired
    private DishService dishService;

    @GetMapping
    public ResponseEntity<List<Dish>> getAllDishService() {
        return new ResponseEntity<>(dishService.getAllDishes(),HttpStatus.OK) ;
    }
}
