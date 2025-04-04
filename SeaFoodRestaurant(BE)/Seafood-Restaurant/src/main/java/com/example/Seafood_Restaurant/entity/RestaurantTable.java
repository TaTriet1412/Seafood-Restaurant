package com.example.Seafood_Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`table`") // Use backticks as 'table' is SQL keyword
public class RestaurantTable { // Renamed class to avoid conflict with java.awt.Table if imported

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status", nullable = false, length = 50)
    private Boolean status = true;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "curr_order_session_id")
    private OrderSession currentOrderSession;
}