package com.example.Seafood_Restaurant.repository;

import com.example.Seafood_Restaurant.entity.OrderSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderSessionRepository extends JpaRepository<OrderSession,Long> {
    List<OrderSession> findByStatus(String status);
    List<OrderSession> findByStatusInOrderByCreatedAtAsc(List<String> statuses);
    
    @Query("""
    SELECT os FROM OrderSession os
    WHERE (:keyword IS NULL OR LOWER(os.status) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND (:year IS NULL OR FUNCTION('YEAR', os.paymentTime) = :year)
    AND (:month IS NULL OR FUNCTION('MONTH', os.paymentTime) = :month)
    AND (:day IS NULL OR FUNCTION('DAY', os.paymentTime) = :day)
    AND os.paymentTime IS NOT NULL
""")
    Page<OrderSession> searchWithFilters(
            @Param("keyword") String keyword,
            @Param("year") Integer year,
            @Param("month") Integer month,
            @Param("day") Integer day,
            Pageable pageable
    );

    Page<OrderSession> findByPaymentTimeBetweenAndPaymentTimeIsNotNull(LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);

}
