package com.bookingassistant.backend.persistence.repository;

import com.bookingassistant.backend.model.booking.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findAllByPropertyRef(String propertyRef);
    @Query("{'room': ?0, $and: [{'start': {$lt: ?2}}, {'end': {$gt: ?1}}]}")
    List<Booking> findOverlappingBookings(String roomId, Date startDate, Date endDate);

    @Query("{'room': {$exists: true}, 'start': {'$lte': ?1}, 'end': {'$gte': ?0}}")
    List<Booking> findBookingsInDateRange(Date startDate, Date endDate);

    List<Booking> findAllByRoom(String roomId);

    List<Booking> findByStartDateBetween(LocalDate start, LocalDate end);
}
