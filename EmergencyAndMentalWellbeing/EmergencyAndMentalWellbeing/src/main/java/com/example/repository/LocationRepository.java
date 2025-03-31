package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.model.Location;

public interface LocationRepository extends MongoRepository<Location, String> {
}