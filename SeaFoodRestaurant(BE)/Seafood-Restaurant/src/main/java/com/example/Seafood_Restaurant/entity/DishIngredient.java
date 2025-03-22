package com.example.Seafood_Restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor @AllArgsConstructor
@IdClass(DishIngredientId.class)
public class DishIngredient {

    @Id
    @ManyToOne
    @JoinColumn(name = "dish_id", nullable = false)
    Dish dish;

    @Id
    @Column(nullable = false)
    Long material_id;

    Integer quantity;

    @Column(length = 100)
    String unit;
}

