package com.bookingassistant.backend.persistence.repository;

import com.bookingassistant.backend.model.auth.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    List<User> findAllByPropertyRef(String propertyRef);
}
