package com.example.Seafood_Restaurant.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DishIngredientId implements Serializable {
    Long dish;
    Long material_id;
}
