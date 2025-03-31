package com.example.repository;

import com.example.model.MoodEntry;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MoodEntryRepository extends MongoRepository<MoodEntry, String> {
    List<MoodEntry> findByUserId(String userId);
    List<MoodEntry> findByUserIdAndDateBetween(String userId, String startDate, String endDate);
}