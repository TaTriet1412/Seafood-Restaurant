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
    Long id;

    @Column(name = "table_type", nullable = false, length = 100)
    String tableType;

    @Column(nullable = false, length = 50)
    String status = "Available"; // Default from SQL

    @Column(nullable = false)
    Integer capacity;

    // Owning side of the OneToOne relationship with OrderSession
    // This table currently has this order session active.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curr_order_session_id", referencedColumnName = "id") // Foreign key
            OrderSession currentOrderSession; // Field name referencing the active session
}