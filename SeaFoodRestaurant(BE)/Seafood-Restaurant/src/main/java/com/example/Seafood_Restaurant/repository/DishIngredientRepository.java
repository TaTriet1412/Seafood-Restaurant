package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
}
