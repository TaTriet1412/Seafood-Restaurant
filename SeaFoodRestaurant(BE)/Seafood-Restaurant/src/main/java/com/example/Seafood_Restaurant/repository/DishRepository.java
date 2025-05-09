package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {
    List<Dish> findByCategoryId(Long catId);
    List<Dish> findByCategoryIdAndAble(Long categoryId, Boolean able);
}
