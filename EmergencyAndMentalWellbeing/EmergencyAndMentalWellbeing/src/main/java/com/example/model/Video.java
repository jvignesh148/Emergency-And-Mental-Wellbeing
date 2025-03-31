package com.example.model;

import lombok.Data;

@Data
public class Video {
    private String videoId;
    private String title;
    private String thumbnailUrl;
    private String youtubeUrl;
    private String category;

    

    /**
     * @return String return the videoId
     */
    public String getVideoId() {
        return videoId;
    }

    /**
     * @param videoId the videoId to set
     */
    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    /**
     * @return String return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title the title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * @return String return the thumbnailUrl
     */
    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    /**
     * @param thumbnailUrl the thumbnailUrl to set
     */
    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    /**
     * @return String return the youtubeUrl
     */
    public String getYoutubeUrl() {
        return youtubeUrl;
    }

    /**
     * @param youtubeUrl the youtubeUrl to set
     */
    public void setYoutubeUrl(String youtubeUrl) {
        this.youtubeUrl = youtubeUrl;
    }

    /**
     * @return String return the category
     */
    public String getCategory() {
        return category;
    }

    /**
     * @param category the category to set
     */
    public void setCategory(String category) {
        this.category = category;
    }

}