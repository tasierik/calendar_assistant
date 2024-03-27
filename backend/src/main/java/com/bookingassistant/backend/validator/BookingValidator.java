package com.bookingassistant.backend.validator;

import com.bookingassistant.backend.exception.*;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.model.booking.BookingCriterias;
import com.bookingassistant.backend.model.Constants;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.util.List;

@Service
@AllArgsConstructor
public class BookingValidator {

    public void validateGetBookingsRequest(MultiValueMap<String, String> queryMap) {

        if (queryMap.keySet().stream().anyMatch(criteria -> !BookingCriterias.contains(criteria))) {
            throw new BookingException(ErrorCode.ILLEGAL_ARGUMENT, "Criteria set contains not valid element.");
        }

    }

    public void validatePostBookingRequest(Booking request) {
        if (request.getId() != null) {
            throw new NotAllowedFieldException("id");
        }
        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new InvalidRequestBodyException("title");
        }
        if (request.getBookingPlatform() == null || request.getBookingPlatform().isEmpty()) {
            throw new InvalidRequestBodyException("bookingPlatform");
        }
        if (request.getRoom() == null || request.getRoom().isEmpty()) {
            throw new InvalidRequestBodyException("room");
        }
        if (request.getStart() == null) {
            throw new InvalidRequestBodyException("start");
        }
        if (request.getEnd() == null) {
            throw new InvalidRequestBodyException("end");
        }
        if (request.getNumberOfGuests() == null) {
            throw new InvalidRequestBodyException("numberOfGuests ");
        }
        if (request.getPaymentMethod() == null || request.getPaymentMethod().isEmpty()) {
            throw new InvalidRequestBodyException("paymentMethod");
        }
        if (request.getTotalPrice() == null) {
            throw new InvalidRequestBodyException("totalPrice");
        }
        if (request.getCurrency() == null || request.getCurrency().isEmpty()) {
            throw new InvalidRequestBodyException("currency");
        }
    }

    public void validatePatchBookingRequest(String id, List<String> fields, Booking request) {
        if (id == null) {
            throw new BookingException(ErrorCode.INVALID_REQUEST_BODY, "id");
        }


        for (String field : fields) {
            if (!Constants.allowedBookingFields.contains(field)) {
                throw new NotAllowedFieldException(field);
            }
            Object value = getValueFromBooking(request, field);
            if (value == null) {
                throw new InvalidRequestBodyException(field);
            }
        }
    }

    private Object getValueFromBooking(Booking booking, String field) {
        return switch (field) {
            case "title" -> booking.getTitle();
            case "bookingPlatform" -> booking.getBookingPlatform();
            case "room" -> booking.getRoom();
            case "start" -> booking.getStart();
            case "end" -> booking.getEnd();
            case "numberOfGuests" -> booking.getNumberOfGuests();
            case "paymentMethod" -> booking.getPaymentMethod();
            case "totalPrice" -> booking.getTotalPrice();
            case "currency" -> booking.getCurrency();
            case "paid" -> booking.getPaid();
            case "contact" -> booking.getContact();
            case "comment" -> booking.getComment();
            default -> null;
        };
    }
}
