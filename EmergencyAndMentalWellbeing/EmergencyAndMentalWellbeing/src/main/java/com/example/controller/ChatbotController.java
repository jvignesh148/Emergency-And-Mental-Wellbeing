package com.example.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@RestController
@RequestMapping("/chatbot") // Defines /chatbot as the base path
@CrossOrigin(origins = "http://localhost:5173") // Allows requests from frontend
public class ChatbotController {

    private static final String GEMINI_API_KEY = "YOUR OWN GEMINI API KEY";  // Replace with your OpenRouter API key
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + GEMINI_API_KEY;

    private List<String> conversationHistory = new ArrayList<>();

    @PostMapping("/send")
    public Map<String, String> sendMessage(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        System.out.println("✅ Received message: " + userMessage);

        conversationHistory.add("User: " + userMessage);

        String botResponse = callGeminiAPI(userMessage);

        conversationHistory.add("Bot: " + botResponse);

        Map<String, String> response = new HashMap<>();
        response.put("response", botResponse);
        return response;
    }

    @SuppressWarnings("unchecked")
    private String callGeminiAPI(String userMessage) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = "You are a chatbot. Always provide a unique, creative response. Avoid repeating past answers.\n"
                      + "Previous responses: " + String.join(", ", conversationHistory) + "\n"
                      + "User: " + userMessage;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(GEMINI_URL, HttpMethod.POST, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty() && candidates.get(0).containsKey("content")) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                    return parts.get(0).get("text");
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Error calling Gemini API: " + e.getMessage());
            return "⚠ Sorry, I'm experiencing technical difficulties.";
        }
        return "⚠ No response generated.";
    }
}
