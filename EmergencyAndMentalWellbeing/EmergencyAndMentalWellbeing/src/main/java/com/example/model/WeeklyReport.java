package com.example.model;

import java.util.List;

public class WeeklyReport {
    private List<Integer> moodTrend;
    private List<String> dates; // New field to store dates
    private String recommendation;

    public WeeklyReport(List<Integer> moodTrend, List<String> dates, String recommendation) {
        this.moodTrend = moodTrend;
        this.dates = dates;
        this.recommendation = recommendation;
    }

    // Getters and Setters
    public List<Integer> getMoodTrend() { return moodTrend; }
    public void setMoodTrend(List<Integer> moodTrend) { this.moodTrend = moodTrend; }
    public List<String> getDates() { return dates; }
    public void setDates(List<String> dates) { this.dates = dates; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}