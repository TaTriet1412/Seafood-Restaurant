package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishRepository extends JpaRepository<Dish, Long> {
}
