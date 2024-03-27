package com.bookingassistant.backend.controller;


import com.bookingassistant.backend.model.auth.AuthenticationResponse;
import com.bookingassistant.backend.model.auth.AuthenticationRequest;
import com.bookingassistant.backend.model.auth.RegisterRequest;
import com.bookingassistant.backend.model.auth.User;
import com.bookingassistant.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    @Autowired
    private final AuthenticationService authenticationService;

    @PostMapping(value = {"/register"})
    public ResponseEntity<AuthenticationResponse> postRegister(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }
    @PostMapping(value = {"/register/additional"})
    public ResponseEntity<User> postRegisterAdditional(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registerAdditionalUser(request));
    }
    @PostMapping(value = {"/login"})
    public ResponseEntity<AuthenticationResponse> postLogin(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
    @GetMapping(value = {"/userDetails"})
    public ResponseEntity<User> getUserDetails() {
        return ResponseEntity.ok(authenticationService.getAuthenticatedUser());
    }
    @GetMapping(value = {"/relatedUsers"})
    public ResponseEntity<List<User>> getRelatedUsers() {
        return ResponseEntity.ok(authenticationService.getRelatedUsers());
    }
    @DeleteMapping(value = {"/users/{id}"})
    public ResponseEntity<Void> deleteUserById(
            @PathVariable final String id
    ) {
        authenticationService.deleteUserById(id);
        return ResponseEntity.ok().build();
    }
}
