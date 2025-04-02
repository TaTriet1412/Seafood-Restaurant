package com.example.Seafood_Restaurant.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "order_session")
public class OrderSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Inverse side of the OneToOne relationship with Order
    // `mappedBy` indicates that the 'orderSession' field in the Order entity manages this relationship.
    @OneToOne(mappedBy = "orderSession", fetch = FetchType.LAZY)
    @JsonIgnore // To prevent recursion during serialization
            Order order;

    // Owning side: Many OrderSessions can belong to one Shift
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shift_id") // Foreign key column
            Shift shift;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt; // Field name matches Lombok/Java convention

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    BigDecimal totalPrice = BigDecimal.ZERO; // Default from SQL

    @Column(name = "is_paid", nullable = false)
    Boolean isPaid = false; // Default from SQL

    @Column(length = 255)
    String status = "Pending"; // Default from SQL

    @Column(name = "payment_time")
    LocalDateTime paymentTime;

    // Inverse side of the OneToOne relationship with RestaurantTable
    // 'mappedBy' points to the field in RestaurantTable that owns the relationship
    @OneToOne(mappedBy = "currentOrderSession", fetch = FetchType.LAZY)
    @JsonIgnore // To prevent recursion
            RestaurantTable table; // Field referencing the table using this session
}