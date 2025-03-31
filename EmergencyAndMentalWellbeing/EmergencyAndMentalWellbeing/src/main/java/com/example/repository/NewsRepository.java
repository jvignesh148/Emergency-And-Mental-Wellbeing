package com.example.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import com.example.model.NewsArticle;

public interface NewsRepository extends MongoRepository<NewsArticle, String> {
    List<NewsArticle> findByUsername(String username);
}