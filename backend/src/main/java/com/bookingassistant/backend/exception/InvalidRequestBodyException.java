package com.bookingassistant.backend.exception;

public class InvalidRequestBodyException extends BookingException {
    public InvalidRequestBodyException(String param) {
        super(ErrorCode.INVALID_REQUEST_BODY, param + "is missing.");
    }
}
