package com.example.controller;

import com.example.model.WeeklyReport;
import com.example.model.MoodEntry;
import com.example.repository.MoodEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mood")
@CrossOrigin(origins = "http://localhost:3000")
public class MoodController {

    @Autowired
    private MoodEntryRepository repository;

    public MoodController() {
        System.out.println("MoodController initialized");
    }

    @PostMapping("/log")
    public MoodEntry logMood(@RequestBody MoodEntry entry) {
        System.out.println("Received mood entry: " + entry);
        if (entry.getMoodScore() <= 3) {
            entry.setMoodDescription("Sad");
        } else if (entry.getMoodScore() <= 6) {
            entry.setMoodDescription("Neutral");
        } else {
            entry.setMoodDescription("Happy");
        }
        return repository.save(entry);
    }

    @GetMapping("/entries/{userId}")
    public List<MoodEntry> getMoodEntries(@PathVariable String userId) {
        return repository.findByUserId(userId);
    }

    @GetMapping("/weekly-report/{userId}")
    public WeeklyReport getWeeklyReport(@PathVariable String userId) {
        // Calculate the date range (last 7 days)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6); // 7 days including today
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String startDateStr = startDate.format(formatter);
        String endDateStr = endDate.format(formatter);
    
        // Fetch entries for the last 7 days
        List<MoodEntry> entries = repository.findByUserIdAndDateBetween(userId, startDateStr, endDateStr);
    
        // Extract mood scores and dates
        List<Integer> moodTrend = entries.stream()
                .map(MoodEntry::getMoodScore)
                .collect(Collectors.toList());
        List<String> dates = entries.stream()
                .map(MoodEntry::getDate)
                .collect(Collectors.toList());
    
        String recommendation = generateRecommendation(moodTrend);
        return new WeeklyReport(moodTrend, dates, recommendation);
    }
    
    @DeleteMapping("/delete/{id}")
    public void deleteMoodEntry(@PathVariable String id) {
        repository.deleteById(id);
    }

    private String generateRecommendation(List<Integer> moodTrend) {
        if (moodTrend.size() > 1 && moodTrend.get(moodTrend.size() - 1) < moodTrend.get(0)) {
            return "Try incorporating relaxation techniques and ensuring you get adequate rest.";
        }
        return "Keep up the good work!";
    }
}