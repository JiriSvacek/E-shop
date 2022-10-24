package com.egeto.eshop;

import java.time.LocalDateTime;

public class ErrorResponse {
    public String message;
    public LocalDateTime timstamp;

    public ErrorResponse(String message, LocalDateTime now) {
        this.message = message;
        this.timstamp = now;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimstamp() {
        return timstamp;
    }

    public void setTimstamp(LocalDateTime timstamp) {
        this.timstamp = timstamp;
    }
}
