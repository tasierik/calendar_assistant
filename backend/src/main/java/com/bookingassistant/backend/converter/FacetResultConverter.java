package com.bookingassistant.backend.converter;

import com.bookingassistant.backend.model.pagination.FacetResult;
import com.bookingassistant.backend.model.pagination.PageInfo;
import com.bookingassistant.backend.model.pagination.PaginatedResult;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@AllArgsConstructor
public class FacetResultConverter<T,S> implements Converter<FacetResult<T>, PaginatedResult<T>> {

    public PaginatedResult<T> convert(FacetResult<T> source, Pageable pageable) {
        PaginatedResult<T> paginatedResult = new PaginatedResult<>();
        paginatedResult.setRawData(source.getResultData());
        long totalResult = CollectionUtils.isEmpty(source.getPageInfo())? 0L: source.getPageInfo().get(0).getTotalRecords();
        if (totalResult == 0){
            paginatedResult.setPageInfo(new PageInfo( -1L));
        }else {
            paginatedResult.setPageInfo(new PageInfo(totalResult + (long) pageable.getPageSize() * pageable.getPageNumber()));
        }
        paginatedResult.setPageable(pageable);
        return paginatedResult;
    }

    @Override
    public PaginatedResult<T> convert(FacetResult<T> source) {
        return null;
    }
}
