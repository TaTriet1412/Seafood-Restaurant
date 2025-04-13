package com.example.Seafood_Restaurant.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.math.BigInteger;

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
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonBackReference
    @JoinColumn(name = "order_id", nullable = false) // Foreign key column
            Order order;

    // Owning side: Many OrderDetails refer to one Dish
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "dish_id", nullable = false) // Foreign key column
            Dish dish;

    @Column(nullable = false)
    Integer quantity;

    @Column(nullable = false)
    BigInteger price; // Price at the time of ordering

    @Column(length = 255)
    String status = "Ordered"; // Default from SQL


}