package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.AbleDishRequest;
import com.example.Seafood_Restaurant.entity.Dish;
import com.example.Seafood_Restaurant.service.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/dish")
public class DishController {
    @Autowired
    private DishService dishService;

    @GetMapping
    public ResponseEntity<List<Dish>> getAllDish() {
        return new ResponseEntity<>(dishService.getAllDishes(),HttpStatus.OK) ;
    }

    @GetMapping("/category/{catId}")
    public ResponseEntity<List<Dish>> getDishesByCategoryId(@PathVariable Long catId) {
        return new ResponseEntity<>(dishService.getDishesByCategoryId(catId),HttpStatus.OK);
    }

    @PutMapping("/able")
    public ResponseEntity<Dish> toggleAbleDish(@RequestBody AbleDishRequest request) {
        return new ResponseEntity<>(dishService.toggleAbleDish(request),HttpStatus.OK);
    }
}
