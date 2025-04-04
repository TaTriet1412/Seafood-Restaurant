package com.example.Seafood_Restaurant.utils;

public enum OrderDetailStatus {
    ORDERED("Ordered"),   // Đã gửi đến bếp
    COOKING("Cooking"), // Bếp đang chuẩn bị
    CANCELLED("Cancelled"), // Đã hủy
    FINISHED("Finished"),   // Đã hoàn thành
    ;

    private String value;

    OrderDetailStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}