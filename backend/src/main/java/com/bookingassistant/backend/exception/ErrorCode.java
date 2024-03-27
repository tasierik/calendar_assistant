package com.bookingassistant.backend.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    USERNAME_ALREADY_EXISTS(HttpStatus.CONFLICT, "The username is already in use"),
    ROOM_LIMIT_REACHED(HttpStatus.FORBIDDEN, "Room limit reached"),
    GENERAL_EXCEPTION(HttpStatus.FORBIDDEN, "General error happened."),
    PERMISSION_DENIED(HttpStatus.FORBIDDEN, "No permission for that task."),
    ROOM_NOT_AVAILABLE(HttpStatus.FORBIDDEN, "Room not available."),
    ILLEGAL_ARGUMENT(HttpStatus.BAD_REQUEST, "Illegal argument present"),
    INVALID_HEX(HttpStatus.BAD_REQUEST, "Illegal HEX color present."),
    HEX_ALREADY_USED(HttpStatus.BAD_REQUEST, "HEX color already used by an other room."),
    INVALID_NUMBER(HttpStatus.BAD_REQUEST, "Invalid number present"),
    INVALID_REQUEST_BODY(HttpStatus.BAD_REQUEST, "Invalid request body."),
    PAGINATION_ERROR(HttpStatus.BAD_REQUEST, "Pagination error."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Entity not found."),
    MISSING_REQUEST_PARAMETER(HttpStatus.BAD_REQUEST, "Missing request parameter.");

    private final HttpStatus httpStatus;
    private final String defaultMessage;

    private static final String DEFAULT_MESSAGE = "Általános hiba.";

    ErrorCode(HttpStatus httpStatus, String defaultMessage) {
        this.httpStatus = httpStatus;
        this.defaultMessage = defaultMessage;
    }
    ErrorCode(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
        this.defaultMessage = DEFAULT_MESSAGE;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
    }
