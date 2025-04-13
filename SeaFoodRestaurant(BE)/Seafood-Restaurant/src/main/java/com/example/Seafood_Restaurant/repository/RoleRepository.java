package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}
