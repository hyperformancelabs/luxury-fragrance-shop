package com.hyperformancelabs.backend.model.enums;

public enum UserType {
    EMPLOYEE("EMPLOYEE"),
    CUSTOMER("CUSTOMER");
    
    private final String value;
    
    UserType(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
    
    @Override
    public String toString() {
        return value;
    }
}
