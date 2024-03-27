package com.bookingassistant.backend.service;

import com.bookingassistant.backend.model.Constants;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.model.report.Income;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingService bookingService;

    public Income getIncomeBasedOnType(MultiValueMap<String, String> criterias, String propertyRef) {

        String reportType = criterias.get(Constants.TYPE).get(0);
        List<Booking> bookings = bookingService.getAllBookingsByPropertyRef(propertyRef);

        if (!CollectionUtils.isEmpty(bookings)) {
            if (Objects.equals(reportType, Constants.TYPE_MONTHLY)) {
                Month month = Month.valueOf(criterias.get(Constants.FIELD_MONTH).get(0).toUpperCase());
                return new Income(Constants.FIELD_MONTH,
                        calculateTotalPriceForMonth(bookings, month, Constants.CURRENCY_TYPE_HUF),
                        calculateTotalPriceForMonth(bookings, month, Constants.CURRENCY_TYPE_EUR));
            } else {
                int year = Integer.parseInt(criterias.get(Constants.FIELD_YEAR).get(0));
                return new Income(Constants.FIELD_YEAR,
                        calculateTotalPriceForYear(bookings, year, Constants.CURRENCY_TYPE_HUF),
                        calculateTotalPriceForYear(bookings, year, Constants.CURRENCY_TYPE_EUR));
            }
        }
        return new Income("error", 0L, 0L);
    }

    public Long calculateTotalPriceForMonth(List<Booking> bookings, Month month, String currency) {
        return bookings.stream()
                .filter(booking -> Objects.equals(booking.getCurrency(), currency))
                .filter(booking -> {
                    LocalDate localDate = booking.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return localDate.getMonth() == month;
                })
                .mapToLong(Booking::getTotalPrice)
                .sum();
    }
    public Long calculateTotalPriceForYear(List<Booking> bookings, int year, String currency) {
        return bookings.stream()
                .filter(booking -> Objects.equals(booking.getCurrency(), currency))
                .filter(booking -> {
                    LocalDate localDate = booking.getStart().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    return localDate.getYear() == year;
                })
                .mapToLong(Booking::getTotalPrice)
                .sum();
    }
}
