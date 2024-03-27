package com.bookingassistant.backend.exception;

public class EntityNotFoundException extends BookingException {
    public EntityNotFoundException(String message) {
        super(ErrorCode.NOT_FOUND, message);
    }
}