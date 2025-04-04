package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable,Long> {
    public List<RestaurantTable> findAllByOrderByIdAsc();
}
