package com.example.Seafood_Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

// No direct relationships shown needing bidirectional mapping in user's style yet
// Order will have a OneToOne mapping to this

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "order_log")
public class OrderLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column // Default length 255
    String message;

    // Nếu cần truy cập Order từ OrderLog, thêm:
    // @OneToOne(mappedBy = "orderLog", fetch = FetchType.LAZY)
    // @JsonIgnore // Tránh vòng lặp
    // Order order;
}