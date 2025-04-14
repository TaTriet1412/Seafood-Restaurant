package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.dto.request.AbleDishRequest;
import com.example.Seafood_Restaurant.entity.Dish;
import com.example.Seafood_Restaurant.service.DishService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/dish")
@Validated
public class DishController {
    @Autowired
    private DishService dishService;

    @GetMapping
    public ResponseEntity<List<Dish>> getAllDish() {
        return new ResponseEntity<>(dishService.getAllDishes(),HttpStatus.OK) ;
    }

    @GetMapping("/category/{catId}")
    public ResponseEntity<List<Dish>> getDishesByCategoryId(
            @PathVariable Long catId,
            @RequestParam(value = "able", required = false) Boolean able
    ) {
        List<Dish> dishes = dishService.getDishesByCategoryIdAndAble(catId, able);
        return ResponseEntity.ok(dishes);
    }

    @PutMapping("/able")
    public ResponseEntity<Dish> toggleAbleDish(@Valid @RequestBody AbleDishRequest request) {
        return new ResponseEntity<>(dishService.toggleAbleDish(request),HttpStatus.OK);
    }
}
