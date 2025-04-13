package com.example.Seafood_Restaurant.service;

import com.example.Seafood_Restaurant.entity.Shift;
import com.example.Seafood_Restaurant.repository.ShiftRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class ShiftService {
    @Autowired
    ShiftRepository shiftRepository;


    public Shift getCurrentShift() {
        LocalDateTime now = LocalDateTime.now();

        // Tìm shift hiện tại trong DB
        Shift currentShift = shiftRepository.findAll().stream()
                .filter(s -> !now.isBefore(s.getTimeStart()) && !now.isAfter(s.getTimeEnd()))
                .findFirst()
                .orElseGet(() -> {
                    // Xác định thời gian bắt đầu và kết thúc của shift mới
                    LocalDateTime start, end;
                    int hour = now.getHour();

                    if (hour >= 6 && hour < 14) {
                        start = now.withHour(6).withMinute(0).withSecond(0).withNano(0);
                        end = now.withHour(14).withMinute(0).withSecond(0).withNano(0);
                    } else if (hour >= 14 && hour < 22) {
                        start = now.withHour(14).withMinute(0).withSecond(0).withNano(0);
                        end = now.withHour(22).withMinute(0).withSecond(0).withNano(0);
                    } else {
                        // Xử lý ca đêm (22h - 6h sáng hôm sau)
                        start = now.getHour() >= 22
                                ? now.withHour(22).withMinute(0).withSecond(0).withNano(0)
                                : now.minusDays(1).withHour(22).withMinute(0).withSecond(0).withNano(0);
                        end = start.plusHours(8); // 22h - 6h hôm sau
                    }

                    // Tạo và lưu shift mới
                    Shift newShift = Shift.builder()
                            .timeStart(start)
                            .timeEnd(end)
                            .build();
                    return shiftRepository.save(newShift);
                });

        return currentShift;
    }


}
