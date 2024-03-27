package com.bookingassistant.backend.service;

import com.bookingassistant.backend.converter.FacetResultConverter;
import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.EntityNotFoundException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.model.booking.BookingCriterias;
import com.bookingassistant.backend.model.pagination.BookingFacetResult;
import com.bookingassistant.backend.model.pagination.PaginatedResult;
import com.bookingassistant.backend.persistence.repository.BookingRepository;
import com.bookingassistant.backend.persistence.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.FacetOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final MongoTemplate readonlyTemplate;
    private final FacetResultConverter facetResultConverter;

    public PaginatedResult<Booking> getBookingsByCriterias(MultiValueMap<String, String> criterias, Pageable pageable, String propertyRef) {
        ArrayList<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where("propertyRef").in(propertyRef));
        if (!CollectionUtils.isEmpty(criterias)) {
            if (criterias.containsKey(BookingCriterias.ID.getValue())) {
                criteriaList.add(Criteria.where("id").in(criterias.get(BookingCriterias.ID.getValue())));
            }
            if (criterias.containsKey(BookingCriterias.PAID.getValue())) {
                criteriaList.add(Criteria.where("paid").in(Boolean.parseBoolean(criterias.get(BookingCriterias.PAID.getValue()).get(0))));
            }
        }

        List<AggregationOperation> bookingAggregation = criteriaList.stream().map(Aggregation::match).collect(Collectors.toList());

        bookingAggregation.add(Aggregation.sort(Sort.by(Sort.Direction.DESC, "start")));
        bookingAggregation.add(Aggregation.skip(pageable.getOffset()));
        FacetOperation facetOperation = Aggregation.facet()
                .and(Aggregation.limit(pageable.getPageSize()))
                .as("resultData")
                .and(Aggregation.count().as("totalRecords"))
                .as("pageInfo");
        bookingAggregation.add(facetOperation);

        Aggregation aggregation = Aggregation.newAggregation(bookingAggregation);

        AggregationResults<BookingFacetResult> result = readonlyTemplate.aggregate(aggregation, Booking.class, BookingFacetResult.class);
        return facetResultConverter.convert(result.getMappedResults().get(0), pageable);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Booking not found in database with id: " + id));
    }

    public Booking saveBooking(Booking booking) {
        if (!isRoomAvailable(booking.getRoom(), booking.getStart(), booking.getEnd())) {
            throw new BookingException(ErrorCode.ROOM_NOT_AVAILABLE);
        }
        return bookingRepository.save(booking);
    }

    public Booking handlePatchBooking(String id, List<String> fields, Booking request) {
        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));

        if (fields.contains("title")) {
            existingBooking.setTitle(request.getTitle());
        }
        if (fields.contains("bookingPlatform")) {
            existingBooking.setBookingPlatform(request.getBookingPlatform());
        }
        if (fields.contains("room")) {
            existingBooking.setRoom(request.getRoom());
        }
        if (fields.contains("start")) {
            existingBooking.setStart(request.getStart());
        }
        if (fields.contains("end")) {
            existingBooking.setEnd(request.getEnd());
        }
        if (fields.contains("numberOfGuests")) {
            existingBooking.setNumberOfGuests(request.getNumberOfGuests());
        }
        if (fields.contains("paymentMethod")) {
            existingBooking.setPaymentMethod(request.getPaymentMethod());
        }
        if (fields.contains("totalPrice")) {
            existingBooking.setTotalPrice(request.getTotalPrice());
        }
        if (fields.contains("currency")) {
            existingBooking.setCurrency(request.getCurrency());
        }
        if (fields.contains("paid")) {
            existingBooking.setPaid(request.getPaid());
        }
        if (fields.contains("contact")) {
            existingBooking.setContact(request.getContact());
        }
        if (fields.contains("comment")) {
            existingBooking.setComment(request.getComment());
        }

        if (!isRoomAvailable(request.getRoom(), request.getStart(), request.getEnd()) && !Objects.equals(request.getRoom(), existingBooking.getRoom())) {
            throw new BookingException(ErrorCode.ROOM_NOT_AVAILABLE);
        }

        return bookingRepository.save(existingBooking);
    }

    public List<Booking> getAllBookingsByPropertyRef(String propertyRef) {
        return bookingRepository.findAllByPropertyRef(propertyRef);
    }

    public boolean isRoomAvailable(String roomId, Date startDate, Date endDate) {
        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(roomId, startDate, endDate);
        return overlappingBookings.isEmpty();
    }

    public void deleteBookingById(String id) {
        bookingRepository.deleteById(id);
    }
}
