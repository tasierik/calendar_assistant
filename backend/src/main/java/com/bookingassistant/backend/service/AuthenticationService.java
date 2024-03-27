package com.bookingassistant.backend.service;

import com.bookingassistant.backend.config.JwtService;
import com.bookingassistant.backend.exception.*;
import com.bookingassistant.backend.model.Property;
import com.bookingassistant.backend.model.auth.*;
import com.bookingassistant.backend.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PropertyService propertyService;

    public AuthenticationResponse register(RegisterRequest request) {
        Property property = createProperty(request.getPropertyName());
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.HOST)
                .propertyRef(property.getId())
                .propertyName(property.getName())
                .build();
        try {
            userRepository.save(user);
        } catch (DuplicateKeyException e) {
            throw new BookingException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
        String jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwt).build();
    }
    public User registerAdditionalUser(RegisterRequest request) {
        if (getAuthenticatedUser() == null) {
            throw new EntityNotFoundException("User");
        }
        if (request.getRole() == Role.HOST) {
            throw new NotAllowedFieldException("role.type");
        }
        Property property = propertyService.getPropertyById(getAuthenticatedUser().getPropertyRef());
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .propertyRef(property.getId())
                .propertyName(property.getName())
                .build();
        try {
            return userRepository.save(user);
        } catch (DuplicateKeyException e) {
            throw new BookingException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }
    }
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        String jwt = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwt).build();
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalStateException("No authentication found in security context");
        }
        User user = (User) authentication.getPrincipal();
        user.setPassword(null);
        return user;

    }

    public List<User> getRelatedUsers() {
        User currentUser = getAuthenticatedUser();
        return userRepository.findAllByPropertyRef(currentUser.getPropertyRef())
                .stream()
                .peek(user -> user.setPassword(null))
                .filter(user -> !Objects.equals(user.getId(), currentUser.getId()))
                .collect(Collectors.toList());
    }

    public void deleteUserById(String id) {
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    private Property createProperty(String propertyName) {
        return propertyService.saveProperty(Property.builder().name(propertyName).build());
    }

}
