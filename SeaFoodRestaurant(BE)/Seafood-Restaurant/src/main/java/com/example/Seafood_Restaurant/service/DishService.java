package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.dto.request.AbleDishRequest;
import com.example.Seafood_Restaurant.entity.Dish;
import com.example.Seafood_Restaurant.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {
    @Autowired
    private DishRepository dishRepository;

    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    public Dish getDishById(Long id) {
        return dishRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tồn tại món có mã: " + id));
    }

    public Dish toggleAbleDish(AbleDishRequest req) {
        Dish currDish = getDishById(req.dishId());
        currDish.setAble(!currDish.getAble());

        return dishRepository.save(currDish);
    }

    public List<Dish> getDishesByCategoryIdAndAble(Long catId, Boolean able) {
        List<Dish> dishes;

        if (able == null) {
            // No filtering by 'able', return all dishes for the category
            dishes = dishRepository.findByCategoryId(catId);
        } else {
            // Filter dishes based on the 'able' property
            dishes = dishRepository.findByCategoryIdAndAble(catId, able);
        }

        if (dishes.isEmpty()) {
            throw new RuntimeException("Không tìm thấy món ăn nào trong danh mục với ID: " + catId +
                    (able != null ? " và trạng thái 'able' = " + able : ""));
        }

        return dishes;
    }
}
