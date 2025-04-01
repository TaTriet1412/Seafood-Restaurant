package com.example.Seafood_Restaurant.utils;

public class FieldUtils {
    public static boolean isValidEmail(String email) {
        return email != null && VariableUtils.EMAIL_PATTERN.matcher(email).matches();
    }
}
