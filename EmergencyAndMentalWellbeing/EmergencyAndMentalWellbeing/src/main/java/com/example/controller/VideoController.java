package com.example.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.*;

@RestController
@RequestMapping("/api/videos")
@CrossOrigin(origins = "http://localhost:5173")  // Adjust frontend port if needed
public class VideoController {

    private static final String API_KEY = "YOUR GEMINI YOUTUBE API KEY";  // Replace with your actual key
    private static final String YOUTUBE_SEARCH_URL = 
        "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=%s&key=" + API_KEY;

        @GetMapping("/{query}")
        public ResponseEntity<?> getVideos(@PathVariable String query) {
            try {
                String url = String.format(YOUTUBE_SEARCH_URL, query);
                System.out.println("Requesting YouTube API: " + url);  // Log request URL
        
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        
                // Log the response
                System.out.println("YouTube API Response: " + response.getBody());
        
                if (response.getBody() == null || !response.getBody().containsKey("items")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "No videos found."));
                }
        
                return ResponseEntity.ok(response.getBody());
            } catch (Exception e) {
                e.printStackTrace();  // Log full error
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Collections.singletonMap("error", "Failed to fetch videos: " + e.getMessage()));
            }
        }
}
