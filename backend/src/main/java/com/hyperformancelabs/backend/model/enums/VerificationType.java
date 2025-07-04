package com.hyperformancelabs.backend.model.enums;

public enum VerificationType {
    PASSWORD_RESET("PASSWORD_RESET"),
    EMAIL_VERIFICATION("EMAIL_VERIFICATION"),
    ACCOUNT_ACTIVATION("ACCOUNT_ACTIVATION"),
    SECURITY_ACTION("SECURITY_ACTION");
    
    private final String value;
    
    VerificationType(String value) {
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
