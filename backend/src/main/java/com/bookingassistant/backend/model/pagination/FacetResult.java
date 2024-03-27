package com.bookingassistant.backend.model.pagination;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class FacetResult<T> {
    private List<T> resultData;
    private List<PageInfo> pageInfo;
    private Pageable pageable;
}