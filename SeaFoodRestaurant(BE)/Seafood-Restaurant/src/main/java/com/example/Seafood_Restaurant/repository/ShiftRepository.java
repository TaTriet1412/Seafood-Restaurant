package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift,Long> {

}
