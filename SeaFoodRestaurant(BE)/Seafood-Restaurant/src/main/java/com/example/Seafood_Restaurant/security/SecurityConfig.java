package com.example.Seafood_Restaurant.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig  {
    private final JwtAuthenticationFilter  jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
//                        Auth
                        .requestMatchers( "/auth/**")
                            .permitAll()

//                        Dish
                        .requestMatchers("/dish/**")
                            .hasAnyRole("Manager","Staff")
                        .requestMatchers("/images/**")
                            .hasAnyRole("Manager", "Staff")

//                        Table
                        .requestMatchers("/table/**")
                            .hasAnyRole("Manager", "Staff")

//                        Payment
                        .requestMatchers("/payments/**")
                            .hasAnyRole("Manager", "Staff")

//                        OrderDetail
                        .requestMatchers("/order-detail/check/**")
                            .hasAnyRole("Chef", "Staff")
                        .requestMatchers("/order-detail/finished/**", "/order-detail/cooking/**", "/order-detail/ordered/**")
                            .hasRole("Chef")
                        .requestMatchers("/order-detail/cancelled/**")
                            .hasRole("Staff")


                        // Any other request should be authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);  // Add JWT filter before UsernamePasswordAuthenticationFilter

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:4200");  // Địa chỉ frontend
        configuration.addAllowedMethod("*");  // Cho phép tất cả các phương thức HTTP
        configuration.addAllowedHeader("*");  // Cho phép tất cả các header
        configuration.setAllowCredentials(true);  // Cho phép gửi cookies, authorization header

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // Áp dụng cấu hình cho tất cả endpoint
        return source;
    }
}