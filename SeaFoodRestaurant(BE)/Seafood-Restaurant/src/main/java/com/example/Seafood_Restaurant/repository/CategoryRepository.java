package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
