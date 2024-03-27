package com.bookingassistant.backend.controller;

import com.bookingassistant.backend.config.CalendarConfig;
import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.exception.MissingRequestParamException;
import com.bookingassistant.backend.model.auth.Role;
import com.bookingassistant.backend.model.auth.User;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.model.pagination.PaginatedResult;
import com.bookingassistant.backend.service.BookingService;
import com.bookingassistant.backend.service.PaginationService;
import com.bookingassistant.backend.validator.BookingValidator;
import com.bookingassistant.backend.validator.PageableValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, exposedHeaders = "X-Content-Range")
@RestController
@RequestMapping(value = "/api/v1/")
@RequiredArgsConstructor
public class BookingController {

    private final PageableValidator pageableValidator;
    private final CalendarConfig calendarConfig;
    private final BookingValidator bookingValidator;
    private final PaginationService paginationService;
    private final BookingService bookingService;

    @GetMapping(value = "/bookings")
    public ResponseEntity<List<Booking>> getBookings(
            @AuthenticationPrincipal User loggedInUser,
            @RequestParam(defaultValue = "0") String page,
            @RequestParam(required = false) String size,
            @RequestParam MultiValueMap<String, String> queryMap
    ){
        if (loggedInUser == null) {
            throw new IllegalStateException("No authentication found in security context");
        }
        pageableValidator.validate(page, size, calendarConfig.getMaxBookingSize());
        bookingValidator.validateGetBookingsRequest(queryMap);
        Pageable pageable = paginationService.setPageable(page, size, calendarConfig.getMaxBookingSize());
        PaginatedResult<Booking> paginatedResult = bookingService.getBookingsByCriterias(queryMap, pageable, loggedInUser.getPropertyRef());

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-Content-Range", paginatedResult.toString());
        return ResponseEntity.ok()
                .headers(headers)
                .body(paginatedResult.getRawData());
    }
    @GetMapping(value = "/bookings/{id}")
    public ResponseEntity<Booking> getBooking(
            @AuthenticationPrincipal User loggedInUser,
            @PathVariable String id
    ){
        if (loggedInUser == null) {
            throw new IllegalStateException("No authentication found in security context");
        }
        if (id == null) {
            throw new MissingRequestParamException("id");
        }
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PostMapping(value = "/bookings")
    public ResponseEntity<Booking> postBooking(
            @AuthenticationPrincipal User loggedInUser,
            @RequestBody final Booking request
    ) {
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        bookingValidator.validatePostBookingRequest(request);
        request.setPropertyRef(loggedInUser.getPropertyRef());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.saveBooking(request));
    }

    @PatchMapping(value = "/bookings/{id}")
    public ResponseEntity<Booking> patchBooking(
            @PathVariable final String id,
            @RequestParam(value = "fields") final List<String> fields,
            @RequestBody final Booking request,
            @AuthenticationPrincipal User loggedInUser
    ) {
        if (loggedInUser.getRole() == Role.GUEST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        bookingValidator.validatePatchBookingRequest(id, fields, request);
        request.setPropertyRef(loggedInUser.getPropertyRef());
        return ResponseEntity.ok(bookingService.handlePatchBooking(id, fields, request));
    }
    @DeleteMapping(value = "/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(
            @PathVariable final String id,
            @AuthenticationPrincipal User loggedInUser
    ) {
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        bookingService.deleteBookingById(id);
        return ResponseEntity.ok().build();
    }

}
