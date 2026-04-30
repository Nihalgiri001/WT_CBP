package com.tokenqueue;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Token {
    private int id;
    private String tokenNumber;
    private String status;
    private String timestamp;
    private int estimatedWaitTime;

    public Token(int id) {
        this.id = id;
        this.tokenNumber = String.format("T%03d", id);
        this.status = "waiting";
        this.estimatedWaitTime = 0;
        this.timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }

    public int getId() {
        return id;
    }

    public String getTokenNumber() {
        return tokenNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public int getEstimatedWaitTime() {
        return estimatedWaitTime;
    }

    public void setEstimatedWaitTime(int estimatedWaitTime) {
        this.estimatedWaitTime = estimatedWaitTime;
    }

    public String toJson() {
        return String.format(
                "{\"id\":%d,\"token\":\"%s\",\"status\":\"%s\",\"timestamp\":\"%s\",\"estimatedWaitTime\":%d}",
                id, tokenNumber, status, timestamp, estimatedWaitTime);
    }
}
