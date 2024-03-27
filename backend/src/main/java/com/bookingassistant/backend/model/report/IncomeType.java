package com.bookingassistant.backend.model.report;


public enum IncomeType {
    MONTHLY("monthly"),
    YEARLY("yearly");

    private String value;

    IncomeType(String name) {this.value = name;};

    public String getValue() {return value;};

    public static boolean contains(String value) {
        for (IncomeType item : values()) {
            if (item.getValue().equals(value)) {
                return true;
            }
        }
        return false;
    }
}
