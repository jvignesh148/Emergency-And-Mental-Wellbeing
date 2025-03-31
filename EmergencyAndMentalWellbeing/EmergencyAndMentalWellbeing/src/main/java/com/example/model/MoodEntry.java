package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "moodEntries")
public class MoodEntry {
    @Id
    private String id;
    private String userId;
    private String date;
    private int moodScore;
    private String moodDescription;
    private String journalEntry;
    private int sleepHours;
    private int waterIntake;

    // Constructors
    public MoodEntry() {}

    public MoodEntry(String userId, String date, int moodScore, String moodDescription, String journalEntry, int sleepHours, int waterIntake) {
        this.userId = userId;
        this.date = date;
        this.moodScore = moodScore;
        this.moodDescription = moodDescription;
        this.journalEntry = journalEntry;
        this.sleepHours = sleepHours;
        this.waterIntake = waterIntake;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public int getMoodScore() { return moodScore; }
    public void setMoodScore(int moodScore) { this.moodScore = moodScore; }
    public String getMoodDescription() { return moodDescription; }
    public void setMoodDescription(String moodDescription) { this.moodDescription = moodDescription; }
    public String getJournalEntry() { return journalEntry; }
    public void setJournalEntry(String journalEntry) { this.journalEntry = journalEntry; }
    public int getSleepHours() { return sleepHours; }
    public void setSleepHours(int sleepHours) { this.sleepHours = sleepHours; }
    public int getWaterIntake() { return waterIntake; }
    public void setWaterIntake(int waterIntake) { this.waterIntake = waterIntake; }
}