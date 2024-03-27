package com.bookingassistant.backend.model.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    private String id;
    private String propertyRef;
    private String title;
    private String bookingPlatform;
    private String contact;
    private String room;
    private Date start;
    private Date end;
    private Integer numberOfGuests;
    private String paymentMethod;
    private Long totalPrice;
    private String currency;
    private Boolean paid;
    private String comment;
}
