package com.bookingassistant.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public CustomRequestResponseLoggingFilter requestResponseLoggingFilter() {
        return new CustomRequestResponseLoggingFilter();
    }
}