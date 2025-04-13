package com.example.Seafood_Restaurant.utils;


import java.util.regex.Pattern;

public class VariableUtils {
    public static final String UPLOAD_DIR_ROOT = "uploads";
    public static final String UPLOAD_DIR_DISH = "uploads/dishes";
    public static final String UPLOAD_DIR_DISH_POSTFIX = "dishes/";

    public static final int TYPE_UPLOAD_DISH_SERVICE = 1;
    public static final String TYPE_UPLOAD_DISH_SERVICE_PATH = "dishes";


    public static final Long ROLE_MANAGER_ID = 1L;
    public static final Long ROLE_STAFF_ID = 2L;
    public static final Long ROLE_CHEF_ID = 3L;
    public static final String ROLE_CHEF_STRING = "Chef";
    public static final String ROLE_MANAGER_STRING = "Manager";
    public static final String ROLE_STAFF_STRING = "Staff";

    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    public static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public static String getStringFromUploadType(int uploadType) {
        return switch (uploadType) {
            case TYPE_UPLOAD_DISH_SERVICE -> TYPE_UPLOAD_DISH_SERVICE_PATH;
            default -> "";
        };
    }
}
