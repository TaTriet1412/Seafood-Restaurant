package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.OrderSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderSessionRepository extends JpaRepository<OrderSession,Long> {
}
