package com.bookingassistant.backend.exception;

public class MissingRequestParamException extends BookingException {
    public MissingRequestParamException(String param) {
        super(ErrorCode.MISSING_REQUEST_PARAMETER, param + "is missing");
    }
}
