package com.example.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import com.example.service.NewsService; // Add this
import com.example.model.NewsArticle;  

@RestController
@RequestMapping("/news")
@CrossOrigin(origins = "http://localhost:5173")
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/fetch")
    public String fetchNews(@RequestParam String query) {
        return newsService.fetchNewsFromAPI(query);
    }

    @PostMapping("/save")
    public void saveNews(@RequestBody Map<String, Object> request) {
        String username = (String) request.get("username");
        @SuppressWarnings("unchecked")
        Map<String, String> article = (Map<String, String>) request.get("article");
        newsService.saveNews(new NewsArticle(username, article.get("title"), article.get("description")));
    }

    @GetMapping("/user/{username}")
    public List<NewsArticle> getUserNews(@PathVariable String username) {
        return newsService.getUserNews(username);
    }
}