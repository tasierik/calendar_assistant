package com.bookingassistant.backend.model.booking;

public enum BookingCriterias {
    ID("id"),
    START("start"),
    END("end"),
    PAID("paid"),
    PAGE("page"),
    SIZE("size"),
    PROPERTY_REF("propertyRef");

    private String value;

    BookingCriterias(String name) {this.value = name;};

    public String getValue() {return value;};

    public static boolean contains(String value) {
        for (BookingCriterias item : values()) {
            if (item.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}
