package com.bookingassistant.backend.exception;

import com.bookingassistant.backend.model.ErrorResponse;
import org.springframework.http.HttpStatus;

public class BookingException extends RuntimeException {
    private final ErrorResponse errorResponse;
    private final HttpStatus httpStatus;

    public BookingException(ErrorCode errorCode) {
        super(errorCode.getDefaultMessage());
        this.errorResponse = new ErrorResponse(errorCode.name(), errorCode.getDefaultMessage());
        this.httpStatus = errorCode.getHttpStatus();
    }

    public BookingException(ErrorCode errorCode, String customMessage) {
        super(customMessage);
        this.errorResponse = new ErrorResponse(errorCode.name(), customMessage);
        this.httpStatus = errorCode.getHttpStatus();
    }

    public ErrorResponse getErrorResponse() {
        return errorResponse;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }


}