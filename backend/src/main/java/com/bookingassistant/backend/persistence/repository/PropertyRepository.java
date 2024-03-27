package com.bookingassistant.backend.persistence.repository;

import com.bookingassistant.backend.model.Property;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Service
@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
}
