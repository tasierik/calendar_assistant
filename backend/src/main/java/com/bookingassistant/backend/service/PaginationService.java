package com.bookingassistant.backend.service;

import io.micrometer.common.util.StringUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PaginationService {
    public Pageable setPageable(String pageParam, String sizeParam, int maxPageSize) {
        if (StringUtils.isBlank(pageParam) && StringUtils.isBlank(sizeParam)) {
            return null;
        }
        int page = StringUtils.isBlank(pageParam) ? 0 : Integer.parseInt(pageParam);
        int pageSize = StringUtils.isBlank(sizeParam) ? maxPageSize : Integer.parseInt(sizeParam);

        return PageRequest.of(page, pageSize);
    }
}