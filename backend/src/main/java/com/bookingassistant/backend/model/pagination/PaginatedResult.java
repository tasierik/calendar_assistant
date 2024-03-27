package com.bookingassistant.backend.model.pagination;

import lombok.Data;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Data
public class PaginatedResult<S> {
    private List<S> rawData;
    private PageInfo pageInfo;
    private Pageable pageable;

    @Override
    public String toString() {
        if (pageInfo.getTotalRecords() == -1){
            return pageable.getPageNumber() + "/" + pageable.getPageSize() + "/*";
        }
        return pageable.getPageNumber() + "/" + pageable.getPageSize() + "/" + pageInfo.getTotalRecords();
    }
}
