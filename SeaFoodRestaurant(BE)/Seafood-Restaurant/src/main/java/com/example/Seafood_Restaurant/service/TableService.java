package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.RestaurantTable;
import com.example.Seafood_Restaurant.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TableService {
    @Autowired
    private TableRepository tableRepository;

    public List<RestaurantTable> getAllTableOrderByIdAsc() {
        return tableRepository.findAllByOrderByIdAsc();
    }
}
