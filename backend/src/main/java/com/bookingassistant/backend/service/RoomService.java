package com.bookingassistant.backend.service;

import com.bookingassistant.backend.config.CalendarConfig;
import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.EntityNotFoundException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.model.room.Room;
import com.bookingassistant.backend.persistence.repository.BookingRepository;
import com.bookingassistant.backend.persistence.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final CalendarConfig calendarConfig;

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Room not found in database with id: " + id));
    }
    public List<Room> getRoomsByPropertyRef(String propertyRef) {
        return roomRepository.findByPropertyRef(propertyRef);
    }
    public Room saveRoom(Room room) {
        if (roomRepository.countByPropertyRef(room.getPropertyRef()) >= calendarConfig.getMaxRoomNumber()) {
            throw new BookingException(ErrorCode.ROOM_LIMIT_REACHED, "Room limit reached! Limit: " + calendarConfig.getMaxRoomNumber());
        }
        if (!roomRepository.findByPropertyRefAndColor(room.getPropertyRef(), room.getColor()).isEmpty()) {
            throw new BookingException(ErrorCode.HEX_ALREADY_USED);
        }
        return roomRepository.save(room);
    }

    public Room handlePatchRoom(String id, List<String> fields, Room request) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room not found with id: " + id));

        if (fields.contains("displayName")) {
            existingRoom.setDisplayName(request.getDisplayName());
        }
        if (fields.contains("color")) {
            existingRoom.setColor(request.getColor());
        }
        if (fields.contains("priceInHuf")) {
            existingRoom.setPriceInHuf(request.getPriceInHuf());
        }
        if (fields.contains("priceInEur")) {
            existingRoom.setPriceInEur(request.getPriceInEur());
        }
        if (fields.contains("capacity")) {
            existingRoom.setCapacity(request.getCapacity());
        }

        return roomRepository.save(existingRoom);
    }

    public Set<Room> getAvailableRoomsForBooking(String bookingId, Date startDate, Date endDate, String propertyRef) {
        Date normalizedStartDate = atStartOfDay(startDate);
        Date normalizedEndDate = atStartOfDay(endDate);
        List<Room> allRooms = roomRepository.findByPropertyRef(propertyRef);
        return allRooms.stream()
                .filter(room -> {
                    List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(room.getId(), normalizedStartDate, normalizedEndDate);
                    if (overlappingBookings.size() == 1 && Objects.equals(bookingId, overlappingBookings.get(0).getId())) {
                        overlappingBookings = Collections.emptyList();
                    }
                    return overlappingBookings.isEmpty();
                })
                .collect(Collectors.toSet());
    }
    //For correcting +1 hour read bug.
    public Date atStartOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 1);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    public void deleteRoomById(String id) {
        List<Booking> bookings = bookingRepository.findAllByRoom(id);
        if (!bookings.isEmpty()) {
            bookings.forEach(booking -> bookingRepository.deleteById(booking.getId()));
        }
        roomRepository.deleteById(id);
    }
}
