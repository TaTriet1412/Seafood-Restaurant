package com.example.Seafood_Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "order_detail")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Owning side: Many OrderDetails belong to one Order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false) // Foreign key column
            Order order;

    // Owning side: Many OrderDetails refer to one Dish
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id", nullable = false) // Foreign key column
            Dish dish;

    @Column(nullable = false)
    Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal price; // Price at the time of ordering

    @Column(length = 255)
    String status = "Ordered"; // Default from SQL

    @Column(columnDefinition = "TEXT")
    String note;
}