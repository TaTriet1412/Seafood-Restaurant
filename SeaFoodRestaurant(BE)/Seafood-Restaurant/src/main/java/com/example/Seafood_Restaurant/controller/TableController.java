package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.entity.RestaurantTable;
import com.example.Seafood_Restaurant.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/table")
public class TableController {
    @Autowired
    private TableService tableService;

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTable() {
        return new ResponseEntity<>(tableService.getAllTableOrderByIdAsc(), HttpStatus.OK) ;
    }

}
