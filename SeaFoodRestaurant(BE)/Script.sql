CREATE DATABASE seafood_restaurant
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE seafood_restaurant;

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Bảng Category
CREATE TABLE Category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name TEXT NOT NULL
);

-- Bảng Dish
CREATE TABLE Dish (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(60, 2) NOT NULL,
    able BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES Category(id) ON DELETE CASCADE
);

-- Bảng DishImage
CREATE TABLE DishImage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    image TEXT,
    isThumb BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (dish_id) REFERENCES Dish(id) ON DELETE CASCADE
);

-- Bảng DishIngredient
CREATE TABLE DishIngredient (
    dish_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    quantity INT,
    unit VARCHAR(100),
    PRIMARY KEY (dish_id, material_id),
    FOREIGN KEY (dish_id) REFERENCES Dish(id) ON DELETE CASCADE
);
