package com.bookingassistant.backend.config;

import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

public class CustomRequestResponseLoggingFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(CustomRequestResponseLoggingFilter.class);
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        ContentCachingRequestWrapper cachedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper cachedResponse = new ContentCachingResponseWrapper(response);
        filterChain.doFilter(cachedRequest, cachedResponse);
        logRequestDetails(cachedRequest);
        logResponseDetails(cachedResponse);
    }

    private void logRequestDetails(HttpServletRequest request) throws UnsupportedEncodingException {
        ContentCachingRequestWrapper requestWrapper = (ContentCachingRequestWrapper) request;
        String requestBody = new String(requestWrapper.getContentAsByteArray(), request.getCharacterEncoding());

        log.info("Request: " + request.getMethod() + " " + request.getRequestURL().toString() + ", Body: " + requestBody);
    }

    private void logResponseDetails(HttpServletResponse response) throws IOException {
        ContentCachingResponseWrapper responseWrapper = (ContentCachingResponseWrapper) response;
        String responseBody = new String(responseWrapper.getContentAsByteArray(), response.getCharacterEncoding());
        responseWrapper.copyBodyToResponse();

        log.info("Response: " + response.getStatus() + ", Body: " + responseBody);
    }
}