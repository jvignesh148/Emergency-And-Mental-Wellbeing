import React, { useState, useEffect } from "react";
import axios from "axios";
import '../Styles/VideoRecommendation.css';


const categories = [
    "Self help",
    "Reducing stress",
    "Anxiety",
    "Panic attacks",
    "Breathing exercises",
    "Stretching",
    "Calm music",
    "Meditation",
  ];

const VideoRecommendation = () => {
    const [query, setQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const fetchVideos = async (searchTerm = query) => {
        if (!searchTerm) {
          alert("Please enter text");
          return;
        }

        try {
          const response = await axios.get(`http://localhost:8080/api/videos/${encodeURIComponent(searchTerm)}`);
          console.log("Backend Response:", response.data);
          setVideos(response.data.items || []);
        } catch (error) {
          
          console.error("Error fetching videos:", error);
          alert(error.response?.data?.error || "Failed to load videos.");
        }
    };
      
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setQuery(category);
        fetchVideos(category);
      };


    return (
    <div className="video-container">
        <header>  
            <nav>
                <ul>
                    <li id='topic'>ZenAlert</li>
                    <li><a href='/home'>Home</a></li>
                    <li><a href='/sos'>SOS Help</a></li>
                    <li><a href='/assessment'>Assessment</a></li>
                    <li><a href='/chatbot'>Chatbot</a></li>
                    <li><a href='/videos'>videos</a></li>
                    <li><a href='/mood-track'>Mood Track</a></li>
                    <li><a href='/news-api'>News API</a></li>
                    <li><a href='/task-management'>Task Management</a></li>
                </ul>
            </nav>
        </header>
      <h2>Video Recommendations</h2>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => fetchVideos(query)}>Search</button>
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Video Results */}
      <div className="video-list">
        {videos.map((video) => (
          <div key={video.id.videoId} className="video-card">
            <h3>{video.snippet.title}</h3>
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoRecommendation;
