package com.bookingassistant.backend.config;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;

import java.io.CharArrayWriter;
import java.io.PrintWriter;

public class CustomResponseWrapper extends HttpServletResponseWrapper {

    private CharArrayWriter charWriter = new CharArrayWriter();
    private PrintWriter writer = new PrintWriter(charWriter);

    public CustomResponseWrapper(HttpServletResponse response) {
        super(response);
    }

    @Override
    public PrintWriter getWriter() {
        return writer;
    }

    public String getResponseBody() {
        writer.flush();
        return charWriter.toString();
    }
}