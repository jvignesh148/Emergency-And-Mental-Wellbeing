package com.example.repository;

import com.example.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByUserId(String userId);

    // Add the missing method
    List<Task> findByUserIdAndPriority(String userId, String priority);
}