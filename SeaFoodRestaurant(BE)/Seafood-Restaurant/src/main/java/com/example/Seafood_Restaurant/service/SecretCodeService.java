package com.example.Seafood_Restaurant.service;
import com.example.Seafood_Restaurant.dto.request.ValidateSecretCodeReq;
import com.example.Seafood_Restaurant.exception.SimpleHttpException;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.Random;

@Service
public class SecretCodeService {

    private static final String SECRET_CODE_KEY = "secret:code"; // Key chung để lưu Secret Code
    private final Gson gson = new Gson(); // Dùng để chuyển đổi sang JSON

    @Value("${secret.code.timeout:28800}") // Thời gian tồn tại mặc định: 28800 giây (8 giờ)
    private long defaultTimeout;

    @Autowired
    private StringRedisTemplate redisTemplate;

    public String generateAndSaveSecretCode() {
        // 1. Tạo mã bí mật ngẫu nhiên gồm 6 chữ số
        String secretCode = String.format("%06d", new Random().nextInt(999999));

        // 2. Lưu mã bí mật vào Redis với thời gian tồn tại mặc định (ghi đè nếu đã tồn tại)
        redisTemplate.opsForValue().set(
                SECRET_CODE_KEY,                      // Key
                secretCode,                           // Value (secret code)
                Duration.ofSeconds(defaultTimeout)    // Thời gian hết hạn
        );
        System.out.println("Secret code: " + secretCode);

        // 3. Trả về mã bí mật dưới dạng JSON
        return gson.toJson(secretCode);
    }

    // Validate the provided secret code
    public String validateSecretCode(ValidateSecretCodeReq req) {
        String inputCode = req.secretCode();
        String storedCode = redisTemplate.opsForValue().get(SECRET_CODE_KEY);

        if (storedCode == null) {
            throw new SimpleHttpException(HttpStatus.NOT_FOUND, "Secret code không tồn tại hoặc hết hạn"); // Nếu không có mã
        }

        if (!storedCode.equals(inputCode)) {
            throw new SimpleHttpException(HttpStatus.UNAUTHORIZED, "Sai Secret Code"); // Nếu sai mã
        }

        // Nếu hợp lệ, trả về thông báo thành công
        return gson.toJson("Xác thực thành công");
    }
}