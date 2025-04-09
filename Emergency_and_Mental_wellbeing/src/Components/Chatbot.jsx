import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Chatbot.css';

const GEMINI_API_KEY = 'ENTER_YOUR_API_KEY'; // Replace with your Gemini API key or use import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const chatBoxRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { userMessage: input, botResponse: '...' };
        setMessages([...messages, newMessage]);

        try {
            const response = await axios.post(GEMINI_URL, {
                contents: [{ parts: [{ text: input }] }]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const botResponse = response.data.candidates[0].content.parts[0].text;
            setMessages(prev => [...prev.slice(0, -1), { userMessage: input, botResponse }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev.slice(0, -1), { userMessage: input, botResponse: 'Error occurred: ' + (error.message || 'Unknown error') }]);
        }

        setInput('');
    };

    return (
        <div className="chatbot-page">
            <header>
                <nav>
                    <ul >
                        <li id="topic">ZenAlert</li>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/sos">SOS Help</Link></li>
                        <li><Link to="/assessment">Assessment</Link></li>
                        <li><Link to="/chatbot">Chatbot</Link></li>
                        <li><Link to="/videos">Videos</Link></li>
                        <li><Link to="/mood-track">Mood Track</Link></li>
                        <li><Link to="/new-api">News API</Link></li>
                        <li><Link to="/task-management">Task Management</Link></li>
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="chatbot-main">
                <div className="chatbot-wrapper">
                    <div className="chatbot-header">
                        <div className="header-content">
                            <span className="bot-icon">🤖</span>
                            <h2>Chatbot Assistant</h2>
                            <span className="status">Online</span>
                        </div>
                    </div>
                    <div className="chatbot-container" ref={chatBoxRef}>
                        {messages.length === 0 ? (
                            <div className="welcome-message">
                                <p>Welcome to your Mental Wellbeing Chatbot!</p>
                                <p>How can I assist you today?</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="message-group">
                                    <div className="user-message">
                                        <span>{msg.userMessage}</span>
                                    </div>
                                    <div className="bot-message">
                                        <span>{msg.botResponse}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your message here..."
                            className="chat-input"
                        />
                        <button onClick={sendMessage} className="send-button">
                            <span className="send-icon">➤</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Chatbot;
