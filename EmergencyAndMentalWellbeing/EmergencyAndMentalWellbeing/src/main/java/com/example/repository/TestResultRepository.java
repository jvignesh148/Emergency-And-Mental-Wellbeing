package com.example.repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.model.TestResult;

public interface TestResultRepository extends MongoRepository<TestResult, String> {
    List<TestResult> findByUserId(String userId);
}