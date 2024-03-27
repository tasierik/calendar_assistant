package com.bookingassistant.backend.controller;

import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.exception.MissingRequestParamException;
import com.bookingassistant.backend.model.auth.Role;
import com.bookingassistant.backend.model.auth.User;
import com.bookingassistant.backend.model.room.Room;
import com.bookingassistant.backend.service.RoomService;
import com.bookingassistant.backend.validator.RoomValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api/v1/")
@RequiredArgsConstructor
public class RoomController {

    private final RoomValidator roomValidator;
    private final RoomService roomService;

    @GetMapping(value = "/rooms")
    public ResponseEntity<List<Room>> getRooms(
            @AuthenticationPrincipal User loggedInUser
    ){
        if (loggedInUser == null) {
            throw new IllegalStateException("No authentication found in security context");
        }

        return ResponseEntity.ok(roomService.getRoomsByPropertyRef(loggedInUser.getPropertyRef()));
    }

    @GetMapping(value = "/rooms/{id}")
    public ResponseEntity<Room> getRoom(
            @PathVariable final String id
    ) {
        if (id == null) {
            throw new MissingRequestParamException("id");
        }
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @PostMapping(value = "/rooms")
    public ResponseEntity<Room> createRoom(
            @AuthenticationPrincipal User loggedInUser,
            @RequestBody final Room request
    ) {
        if (loggedInUser == null) {
            throw new IllegalStateException("No authentication found in security context");
        }
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        request.setPropertyRef(loggedInUser.getPropertyRef());
        roomValidator.validatePostRoomRequest(request);
        return ResponseEntity.ok(roomService.saveRoom(request));
    }
    @PatchMapping(value = "/rooms/{id}")
    public ResponseEntity<Room> createRoom(
            @PathVariable final String id,
            @RequestParam final List<String> fields,
            @RequestBody final Room request,
            @AuthenticationPrincipal User loggedInUser
    ) {
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        roomValidator.validatePatchRoomRequest(id, fields, request);
        return ResponseEntity.ok(roomService.handlePatchRoom(id, fields, request));
    }

    @GetMapping("/rooms/available")
    public ResponseEntity<Set<Room>> getAvailableRooms(
            @RequestParam(value = "bookingId", required = false) String bookingId,
            @RequestParam("start") @DateTimeFormat(pattern = "yyyy-MM-dd") Date start,
            @RequestParam("end") @DateTimeFormat(pattern = "yyyy-MM-dd") Date end,
            @AuthenticationPrincipal User user) {

        Set<Room> availableRooms = roomService.getAvailableRoomsForBooking(bookingId, start, end, user.getPropertyRef());
        return ResponseEntity.ok(availableRooms);
    }

    @DeleteMapping(value = {"/rooms/{id}"})
    public ResponseEntity<Void> deleteRoomById(
            @PathVariable final String id,
            @AuthenticationPrincipal User loggedInUser
    ) {
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        roomService.deleteRoomById(id);
        return ResponseEntity.ok().build();
    }
}
