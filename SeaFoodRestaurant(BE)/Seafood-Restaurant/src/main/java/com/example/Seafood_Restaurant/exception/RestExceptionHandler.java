package com.example.Seafood_Restaurant.exception;

import com.example.Seafood_Restaurant.dto.request.ApiRespone;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
public class RestExceptionHandler {
    protected ResponseEntity<Object> handleHttpMessageNotReadable (HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        String error = "Malformed JSON request";
        return buildResponseEntity(new ApiError(HttpStatus.BAD_REQUEST, error, ex));
    }

    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }


    @ExceptionHandler(RuntimeException.class)
    protected ResponseEntity<Object> handleUncaughtRuntime(RuntimeException ex) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR);
        apiError.setMessage(ex.getMessage());
        ex.printStackTrace(); // Log chi tiết, hoặc dùng logger
        return buildResponseEntity(apiError);
    }

//    @ExceptionHandler(IllegalArgumentException.class)
//    protected ResponseEntity<Object> handleEntityNotFound(
//            IllegalArgumentException ex) {
//        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
//        apiError.setMessage(ex.getMessage());
//        return buildResponseEntity(apiError);
//    }

    // Những error tự định nghĩa
    @ExceptionHandler(value = AppException.class)
    protected ResponseEntity<Object> handlingAppException(AppException e) {
        ApiError apiError = new ApiError(e.getErrorCode().getStatus());
        apiError.setMessage(e.getErrorCode().getMessage());
        return buildResponseEntity(apiError);
    }

    @ExceptionHandler(SimpleHttpException.class)
    protected ResponseEntity<Object> handleSimpleHttpException(SimpleHttpException ex) {
        ApiError apiError = new ApiError(ex.getStatus());
        apiError.setMessage(ex.getMessage());
        return buildResponseEntity(apiError);
    }

    // Xử lý lỗi validation (nếu dùng @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler({ConstraintViolationException.class, IllegalArgumentException.class})
    public ResponseEntity<?> handleValidation(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Lỗi xác thực: " + ex.getMessage());
        response.put("error", true);
        return ResponseEntity.badRequest().body(response);
    }


}
