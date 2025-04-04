package com.example.Seafood_Restaurant.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    ORDERDETAIL_CANCEL_REJECTED(HttpStatus.CONFLICT, "Món đã chuyển sang trạng thái không thể hủy bỏ"),
    ;

    private HttpStatus status;
    private String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

}
