package com.bookingassistant.backend.service;

import com.bookingassistant.backend.exception.EntityNotFoundException;
import com.bookingassistant.backend.model.Property;
import com.bookingassistant.backend.model.booking.Booking;
import com.bookingassistant.backend.persistence.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository propertyRepository;
    public Property saveProperty(Property property) {
        return propertyRepository.save(property);
    }
    public Property getPropertyById(String propertyRef) {
        return propertyRepository.findById(propertyRef).orElseThrow(
                () -> new EntityNotFoundException("Property not found in database with id: " + propertyRef));
    }
}
