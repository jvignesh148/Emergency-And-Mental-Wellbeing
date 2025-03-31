package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "messages")
public class ChatMessage {
    @Id
    private String id;
    private String userMessage;
    private String botResponse;
    private long timestamp;

    public ChatMessage() {}
    public ChatMessage(String userMessage, String botResponse) {
        this.userMessage = userMessage;
        this.botResponse = botResponse;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserMessage() { return userMessage; }
    public void setUserMessage(String userMessage) { this.userMessage = userMessage; }
    public String getBotResponse() { return botResponse; }
    public void setBotResponse(String botResponse) { this.botResponse = botResponse; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}