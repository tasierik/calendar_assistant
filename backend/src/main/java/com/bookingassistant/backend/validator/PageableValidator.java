package com.bookingassistant.backend.validator;

import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.ErrorCode;
import io.micrometer.common.util.StringUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import static com.bookingassistant.backend.model.Constants.FIELD_PAGE;
import static com.bookingassistant.backend.model.Constants.FIELD_SIZE;

@Service
@AllArgsConstructor
public class PageableValidator {
    public void validate(String page, String size, int maxPageSize) {
        if (page != null) {
            checkNumberFormat(FIELD_PAGE, page);
            if (size != null) {
                checkNumberFormat(FIELD_SIZE, size);
                if (Integer.parseInt(size) > maxPageSize) {
                    throw new BookingException(ErrorCode.PAGINATION_ERROR, "Max page size is: " + maxPageSize);
                }
            }
        }
    }

    private void checkNumberFormat(String field, String value) {
        if (StringUtils.isNotBlank(value)) {
            try {
                int num = Integer.parseInt(value);
                if(num < 0) {
                    throw new BookingException(ErrorCode.PAGINATION_ERROR, field + " must be more than zero.");
                }
            } catch (NumberFormatException numberFormatException) {
                throw new BookingException(ErrorCode.PAGINATION_ERROR, field + " must be number.");
            }
        }
    }
}
