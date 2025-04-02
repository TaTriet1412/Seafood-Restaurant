package com.example.Seafood_Restaurant.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "`order`") // Use backticks as 'order' is SQL keyword
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt; // Field name matches Lombok/Java convention

    // Owning side of OneToOne with OrderLog
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Cascade if deleting Order should delete OrderLog
    @JoinColumn(name = "order_log_id", referencedColumnName = "id")
    OrderLog orderLog;

    // Owning side of OneToOne with OrderSession (based on SQL ALTER TABLE)
    // Note: This creates a bidirectional OneToOne dependency.
    // Ensure only one side manages the relationship (usually the one WITHOUT mappedBy).
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Cascade if deleting Order should delete OrderSession
    @JoinColumn(name = "order_session_id", referencedColumnName = "id")
    OrderSession orderSession;

    // One Order has many OrderDetails
    // To match user's style (like Category), this side might be omitted if navigation isn't needed.
    // However, it's common to have it for accessing details from an order.
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Often needed to break recursion with OrderDetail having 'order' field
            List<OrderDetail> orderDetails;
}