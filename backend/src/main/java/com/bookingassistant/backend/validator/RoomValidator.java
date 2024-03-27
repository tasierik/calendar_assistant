package com.bookingassistant.backend.validator;

import com.bookingassistant.backend.config.CalendarConfig;
import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.exception.MissingRequestParamException;
import com.bookingassistant.backend.exception.NotAllowedFieldException;
import com.bookingassistant.backend.model.room.Room;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor
public class RoomValidator {

    private final CalendarConfig config;

    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

    public void validatePostRoomRequest(Room request) {
        validateCommonFields(request);

        if (request.getId() != null) {
            throw new NotAllowedFieldException("id");
        }
    }

    public void validatePatchRoomRequest(String id, List<String> fields, Room request) {
        validateCommonFields(request, fields);
    }

    private void validateCommonFields(Room request) {
        validateCommonFields(request, null);
    }

    private void validateCommonFields(Room request, List<String> fields) {
        if (StringUtils.isEmpty(request.getDisplayName())) {
            throw new MissingRequestParamException("displayName");
        }

        if (StringUtils.isEmpty(request.getColor()) || !isValidColor(request.getColor())) {
            throw new BookingException(ErrorCode.INVALID_HEX);
        }

        validateNumeric(request.getPriceInHuf(), "priceInHuf", fields);
        validateNumeric(request.getPriceInEur(), "priceInEur", fields);
        validateNumeric(request.getCapacity(), "capacity", fields);
    }

    private boolean isValidColor(String color) {
        return HEX_COLOR_PATTERN.matcher(color).matches();
    }

    private <T extends Number> void validateNumeric(T value, String fieldName, List<String> fields) {
        if (fields == null || fields.contains(fieldName)) {
            if (value == null || value.longValue() <= 0) {
                throw new BookingException(ErrorCode.INVALID_NUMBER, fieldName + " cannot be null or below zero.");
            }
        }
    }

}
