package com.hyperformancelabs.backend.dto;

import java.util.List;

/**
 * DTO for search autocomplete responses
 */
public class SearchResponseDto<T> {
    private List<T> results;
    private boolean hasExactMatch;
    
    public SearchResponseDto() {
    }
    
    public SearchResponseDto(List<T> results, boolean hasExactMatch) {
        this.results = results;
        this.hasExactMatch = hasExactMatch;
    }
    
    public List<T> getResults() {
        return results;
    }
    
    public void setResults(List<T> results) {
        this.results = results;
    }
    
    public boolean isHasExactMatch() {
        return hasExactMatch;
    }
    
    public void setHasExactMatch(boolean hasExactMatch) {
        this.hasExactMatch = hasExactMatch;
    }
}
