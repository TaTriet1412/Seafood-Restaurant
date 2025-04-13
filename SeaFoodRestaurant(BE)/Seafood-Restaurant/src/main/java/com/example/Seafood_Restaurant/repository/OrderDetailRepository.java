package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.OrderDetail;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE OrderDetail o SET o.status = :status WHERE o.id = :id")
    void updateOrderDetailStatus(@Param("id") long id, @Param("status") String status);

    @Query("SELECT o.status FROM OrderDetail o WHERE o.id = :id")
    String getStatus(@Param("id") int id);
}
