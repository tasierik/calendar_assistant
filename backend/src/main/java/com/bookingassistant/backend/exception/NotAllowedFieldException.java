package com.bookingassistant.backend.exception;

public class NotAllowedFieldException extends BookingException {
    public NotAllowedFieldException(String param) {
        super(ErrorCode.ILLEGAL_ARGUMENT, "Not allowed field: '" + param + "' is present.");
    }
}
