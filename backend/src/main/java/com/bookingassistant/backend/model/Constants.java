package com.bookingassistant.backend.model;

import java.util.Arrays;
import java.util.List;

public class Constants {
    public static final String FIELD_PAGE = "Page";
    public static final String FIELD_SIZE = "Size";

    public static final String TYPE_MONTHLY = "monthly";
    public static final String FIELD_MONTH = "month";
    public static final String TYPE_YEARLY = "yearly";
    public static final String FIELD_YEAR = "year";
    public static final String TYPE = "type";
    public static final String CURRENCY_TYPE_HUF = "HUF";
    public static final String CURRENCY_TYPE_EUR = "EUR";

    public static final List<String> allowedBookingFields = Arrays.asList(
            "title",
            "bookingPlatform",
            "room",
            "start",
            "end",
            "numberOfGuests",
            "paymentMethod",
            "totalPrice",
            "currency",
            "paid",
            "contact",
            "comment"
    );
}
