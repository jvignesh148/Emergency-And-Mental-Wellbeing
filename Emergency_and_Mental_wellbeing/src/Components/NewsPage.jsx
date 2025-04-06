// NewsPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/NewsPage.css';

const NewsPage = () => {
  const [query, setQuery] = useState('');
  const [newsArticles, setNewsArticles] = useState([]);
  const [username] = useState('user1'); // Replace with actual user authentication
  const [searchInput, setSearchInput] = useState('');

  // Fetch news articles based on the query
  const fetchNews = async () => {
    if (!query.trim()) {
      console.log('Query is empty, skipping fetch.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8080/news/fetch?query=${query}`); // Line 29
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const articles = data.articles ? data.articles.slice(0, 5) : []; // Limit to 5 articles
      setNewsArticles(articles);
    } catch (error) {
      console.error('Error fetching news:', error); // Line 34
      console.error('Error Response:', error.response); // Line 35
    }
  };

  // Save an article for the user
  const handleSaveArticle = async (article) => {
    try {
      await axios.post('http://localhost:8080/news/save', {
        username,
        article: {
          title: article.title,
          description: article.description,
        },
      });
      alert('Article saved successfully!');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchInput.trim()) {
      setQuery(searchInput);
      fetchNews();
    } else {
      alert('Search input is empty, please enter a query.');
    }
  };

  return (
    <div className="container">
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
      <h1 className="header">News Search</h1>

      {/* Search Input and Button */}
      <div className="search-container">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter a topic (e.g., Mental Health)"
          className="search-input"
          required
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* News Articles List */}
      <div className="articles-container">
        {newsArticles.length > 0 ? (
          newsArticles.map((article, index) => (
            <div key={index} className="article-card">
              <h2 className="article-title">{article.title}</h2>
              <p className="article-description">{article.description}</p>
              <button
                onClick={() => handleSaveArticle(article)}
                className="save-button"
              >
                Save Article
              </button>
            </div>
          ))
        ) : (
          <p className="no-articles">No articles found. Try searching for a topic!</p>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
