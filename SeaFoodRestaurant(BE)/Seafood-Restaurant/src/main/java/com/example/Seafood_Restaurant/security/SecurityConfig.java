package com.example.Seafood_Restaurant.security;
import com.example.Seafood_Restaurant.utils.VariableUtils;
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
                            .permitAll()
                        .requestMatchers("/images/**")
                            .permitAll()

//                        Table
                        .requestMatchers("/table/**")
                            .hasAnyRole(VariableUtils.ROLE_MANAGER_STRING,VariableUtils.ROLE_STAFF_STRING)
                        .requestMatchers("/table/*/off")
                            .hasAnyRole(VariableUtils.ROLE_MANAGER_STRING,VariableUtils.ROLE_STAFF_STRING)

//                        Payment
                        .requestMatchers("/payments/**")
                            .hasAnyRole(VariableUtils.ROLE_MANAGER_STRING,VariableUtils.ROLE_STAFF_STRING)

//                        OrderDetail
                        .requestMatchers("/order-detail/check/**")
                            .hasAnyRole(VariableUtils.ROLE_CHEF_STRING, VariableUtils.ROLE_STAFF_STRING)
                        .requestMatchers("/order-detail/finished", "/order-detail/cooking/**", "/order-detail/ordered/**")
                            .hasRole(VariableUtils.ROLE_CHEF_STRING)
                        .requestMatchers("/order-detail/cancelled/**")
                            .hasRole(VariableUtils.ROLE_CHEF_STRING)

//                        OrderSession
                        .requestMatchers("/order-session/**")
                            .permitAll()
                        .requestMatchers("/order-session/filter/time/**")
                            .permitAll()
                        .requestMatchers("/order-session/filter/shift/**")
                            .permitAll()
                        .requestMatchers("/order-session/*/bill/base")
                            .permitAll()
                        .requestMatchers("/order-session/*/logs")
                            .permitAll()
                        .requestMatchers("/order-session/*/all-order")
                            .permitAll()
                        .requestMatchers("/order-session/exits-in-table/bill")
                            .hasAnyRole(VariableUtils.ROLE_MANAGER_STRING, VariableUtils.ROLE_STAFF_STRING)


//                        Order
                        .requestMatchers("/order/**")
                            .hasAnyRole(VariableUtils.ROLE_MANAGER_STRING,VariableUtils.ROLE_STAFF_STRING)

//                        Shift
                        .requestMatchers("/secret-code/generate")
                            .hasRole(VariableUtils.ROLE_MANAGER_STRING)
                        .requestMatchers("/secret-code/validate")
                            .hasAnyRole(VariableUtils.ROLE_STAFF_STRING,VariableUtils.ROLE_MANAGER_STRING)



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