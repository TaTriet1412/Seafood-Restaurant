package com.example.Seafood_Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    // Following the User-Role OneToOne pattern established by user
    // Owning side: One Notification belongs to One Role (based on user's Role-User mapping)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
            Role role;

    @Column(columnDefinition = "TEXT", nullable = false)
    String message;

    @Column(nullable = false)
    Boolean status = false;

    @Column(name = "notification_type", nullable = false, length = 50)
    String notificationType;

    @CreationTimestamp 
    @Column(name = "created_at", nullable = false, updatable = false)
    LocalDateTime createdAt; // Field name matches Lombok/Java convention
}