package com.bookingassistant.backend.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Configuration
@Data
@ConfigurationProperties(prefix = "calendar")
@Validated
@AllArgsConstructor
@NoArgsConstructor
public class CalendarConfig {
    private int maxBookingSize;
    private int maxRoomNumber;
}
