package com.example.Seafood_Restaurant;

import com.example.Seafood_Restaurant.service.AuthService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class SeafoodRestaurantApplication {

	public static void main(String[] args) {
		ApplicationContext applicationContext = SpringApplication.run(SeafoodRestaurantApplication.class, args);
		AuthService authService = applicationContext.getBean(AuthService.class);
		authService.encodeOldPassword();
	}

}
