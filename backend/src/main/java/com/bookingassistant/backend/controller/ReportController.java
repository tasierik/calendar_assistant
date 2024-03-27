package com.bookingassistant.backend.controller;

import com.bookingassistant.backend.exception.BookingException;
import com.bookingassistant.backend.exception.ErrorCode;
import com.bookingassistant.backend.model.auth.Role;
import com.bookingassistant.backend.model.auth.User;
import com.bookingassistant.backend.model.report.Income;
import com.bookingassistant.backend.service.ReportService;
import com.bookingassistant.backend.validator.ReportValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportValidator reportValidator;
    private final ReportService reportService;

    @GetMapping(value = "/income")
    public ResponseEntity<Income> getIncome(
            @AuthenticationPrincipal User loggedInUser,
            @RequestParam MultiValueMap<String, String> criterias
            ) {
        if (loggedInUser == null) {
            throw new IllegalStateException("No authentication found in security context");
        }
        if (loggedInUser.getRole() != Role.HOST) {
            throw new BookingException(ErrorCode.PERMISSION_DENIED);
        }
        reportValidator.validateGetIncomeRequest(criterias);
        return ResponseEntity.ok(reportService.getIncomeBasedOnType(criterias, loggedInUser.getPropertyRef()));

    }

}
