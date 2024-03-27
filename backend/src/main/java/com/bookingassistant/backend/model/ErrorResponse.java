package com.bookingassistant.backend.model;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ErrorResponse {
    private UUID id;
    private LocalDateTime timestamp;
    private String label;
    private String message;

    public ErrorResponse(String label, String message) {
        this.id = UUID.randomUUID();
        this.label = label;
        this.timestamp = LocalDateTime.now();
        this.message = message;
    }

}