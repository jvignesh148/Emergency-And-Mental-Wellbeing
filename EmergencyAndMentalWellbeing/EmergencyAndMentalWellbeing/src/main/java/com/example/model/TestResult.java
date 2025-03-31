package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "TestResults")
public class TestResult {
    @Id
    private String id;
    private String userId;
    private String date;
    private int score;
    private String depressionLevel;

    public TestResult() {}

    public TestResult(String userId, String date, int score, String depressionLevel) {
        this.userId = userId;
        this.date = date;
        this.score = score;
        this.depressionLevel = depressionLevel;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getDepressionLevel() { return depressionLevel; }
    public void setDepressionLevel(String depressionLevel) { this.depressionLevel = depressionLevel; }
}