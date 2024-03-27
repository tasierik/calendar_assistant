package com.bookingassistant.backend.persistence.repository;

import com.bookingassistant.backend.model.room.Room;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Repository
public interface RoomRepository extends MongoRepository<Room, String> {
    List<Room> findByPropertyRef(String propertyRef);
    List<Room> findByPropertyRefAndColor(String propertyRef, String color);
    List<Room> findByIdIn(List<String> ids);
    Long countByPropertyRef(String propertyRef);
}
