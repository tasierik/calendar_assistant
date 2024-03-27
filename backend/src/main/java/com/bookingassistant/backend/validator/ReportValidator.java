package com.bookingassistant.backend.validator;

import com.bookingassistant.backend.model.Constants;
import com.bookingassistant.backend.model.report.IncomeType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import java.time.Month;

import static com.bookingassistant.backend.model.Constants.TYPE_MONTHLY;
import static com.bookingassistant.backend.model.Constants.TYPE_YEARLY;

@Service
@AllArgsConstructor
public class ReportValidator {
    public void validateGetIncomeRequest(MultiValueMap<String, String> criterias) {

        if (!criterias.containsKey("type")) {
            throw new IllegalArgumentException("Criteria must contain 'type'.");
        }

        String typeValue = criterias.getFirst("type").toLowerCase();

        if (!TYPE_MONTHLY.equals(typeValue) && !TYPE_YEARLY.equals(typeValue)) {
            throw new IllegalArgumentException("Invalid 'type' value. Allowed values are: " + TYPE_MONTHLY + " or " + TYPE_YEARLY + ".");
        }

        if (TYPE_MONTHLY.equals(typeValue)) {
            if (!criterias.containsKey("month")) {
                throw new IllegalArgumentException("For 'MONTHLY' type, 'month' criteria is required.");
            }
            String monthValue = criterias.getFirst("month").toUpperCase();
            try {
                Month.valueOf(monthValue);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid 'month' value. It should be a valid month (e.g., 'JANUARY').");
            }
        } else if (TYPE_YEARLY.equals(typeValue)) {
            if (!criterias.containsKey("year")) {
                throw new IllegalArgumentException("For 'YEARLY' type, 'year' criteria is required.");
            }
            String yearValue = criterias.getFirst("year");
            try {
                Integer.parseInt(yearValue);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid 'year' value. It should be a valid year (e.g., '2023').");
            }
        } else {
            throw new IllegalArgumentException("Unknown income type.");
        }
    }
}
