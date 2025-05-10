package com.hyperformancelabs.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Có thể bật lại CSRF protection cho MVC
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/").permitAll() // Cho phép truy cập trang chủ
                .requestMatchers("/shop/**").permitAll()
                .requestMatchers("/products/**").permitAll()
                .requestMatchers("/cart/**").permitAll() // Cho phép truy cập trang giỏ hàng
                .requestMatchers("/checkout/**").permitAll() // Cho phép truy cập trang thanh toán
                .requestMatchers("/wishlist/**").permitAll() // Cho phép truy cập trang danh sách yêu thích
                .requestMatchers("/order-success/**").permitAll() // Cho phép truy cập trang xác nhận đơn hàng thành công
                .requestMatchers("/profile/**").permitAll() // Cho phép truy cập trang thông tin người dùng
                .requestMatchers("/auth/**").permitAll() // Cho phép truy cập trang đăng nhập/đăng ký
                .requestMatchers("/error/**").permitAll()
                .requestMatchers("/about").permitAll() // Cho phép truy cập trang giới thiệu
                .requestMatchers("/contact").permitAll() // Cho phép truy cập trang liên hệ
                .requestMatchers("/blog/**").permitAll()
                .requestMatchers("/register/**").permitAll()// Cho phép truy cập trang blog
                .requestMatchers("/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/") // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login?logout")
                .permitAll()
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}