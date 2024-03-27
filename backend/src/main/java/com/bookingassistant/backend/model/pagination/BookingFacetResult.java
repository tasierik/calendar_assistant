package com.bookingassistant.backend.model.pagination;

import com.bookingassistant.backend.model.booking.Booking;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class BookingFacetResult extends FacetResult<Booking> {
}