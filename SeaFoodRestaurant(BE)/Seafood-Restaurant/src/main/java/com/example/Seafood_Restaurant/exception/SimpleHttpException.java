package com.example.Seafood_Restaurant.exception;

import org.springframework.http.HttpStatus;

public class SimpleHttpException extends RuntimeException {
  private final HttpStatus status;

  public SimpleHttpException(HttpStatus status, String message) {
    super(message);
    this.status = status;
  }

  public HttpStatus getStatus() {
    return status;
  }
}
