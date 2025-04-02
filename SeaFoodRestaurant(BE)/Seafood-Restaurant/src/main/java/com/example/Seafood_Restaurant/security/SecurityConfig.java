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
                        // Allow access to /auth/register and /auth/login without JWT
                        .requestMatchers( "/auth/**")
                            .permitAll()
                        .requestMatchers("/dish/**")
                            .hasAnyRole("Manager","Staff")
                        .requestMatchers("/images/**")
                        .hasAnyRole("Manager", "Staff")

                        // Chỉ ADMIN có quyền quản lý user
                        .requestMatchers("/admin/**")
                            .hasRole("ADMIN")

                        // USER & ADMIN có thể tạo bài viết
                        .requestMatchers(HttpMethod.POST, "/posts/**")
                            .hasAnyRole("USER", "ADMIN")

                        // GUEST có thể xem danh sách bài viết
                        .requestMatchers(HttpMethod.GET, "/posts/**")
                            .hasAnyRole("GUEST", "USER", "ADMIN")

                        // Secure the API endpoints that require JWT
                        .requestMatchers("/api/**")
                            .authenticated()  // Protect /api/** endpoints

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