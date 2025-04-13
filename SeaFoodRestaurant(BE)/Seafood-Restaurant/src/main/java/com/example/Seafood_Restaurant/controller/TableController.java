package com.example.Seafood_Restaurant.controller;

import com.example.Seafood_Restaurant.entity.RestaurantTable;
import com.example.Seafood_Restaurant.service.TableService;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/table")
public class TableController {
    @Autowired
    private TableService tableService;

    Gson gson = new Gson();

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTable() {
        return new ResponseEntity<>(tableService.getAllTableOrderByIdAsc(), HttpStatus.OK) ;
    }

    @GetMapping("{id}")
    public ResponseEntity<RestaurantTable>  getTableById(@PathVariable Long id) {
        return ResponseEntity.ok(tableService.getTableById(id));
    }

    @PostMapping("{id}/off")
    public ResponseEntity<?> offTable(@PathVariable Long id) {
        tableService.offTable(id);
        return ResponseEntity.ok(gson.toJson("Đóng bàn thành công"));
    }

}
