package com.bookingassistant.backend.model.room;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {
    private String id;

    private String propertyRef;

    private String displayName;
    private String color;
    private Long priceInHuf;
    private Long priceInEur;
    private Integer capacity;
}
