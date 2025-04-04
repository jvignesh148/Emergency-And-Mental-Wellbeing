import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WeeklyReport from './WeeklyReport';
import '../Styles/MoodTracker.css';

const MoodTracker = () => {
  const [moodScore, setMoodScore] = useState(5);
  const [journalEntry, setJournalEntry] = useState('');
  const [sleepHours, setSleepHours] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const navigate = useNavigate();

    const getMoodDescription = (score) => {
        if (score <= 3) return 'Sad 😢';
        if (score <= 6) return 'Neutral 😐';
        return 'Happy 😊';
    };

    const handleLogMood = async () => {
        const moodEntry = {
        userId: 'user123',
        date: new Date().toISOString().split('T')[0],
        moodScore,
        moodDescription: getMoodDescription(moodScore),
        journalEntry,
        sleepHours,
        waterIntake,
        };

        try {
        await axios.post('http://localhost:8080/api/mood/log', moodEntry); // Line 33
        alert('Mood logged successfully!');
        } catch (error) {
        console.error('Error logging mood:', error); // Line 36
        alert('Failed to log mood.');
        }
    };

  return (
    <div className="mood-tracker">
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
        <main>
      <div className="mood-input-section">
      <p>
        The mood tracker allows users to log their mood on a sliding scale and provides insights into their emotional state over time.
        Weekly reports are generated to help users identify patterns and trends in their mood.
      </p>
        <h2>Rate Your Mood</h2>
        <input
          type="range"
          min="1"
          max="10"
          value={moodScore}
          onChange={(e) => setMoodScore(Number(e.target.value))}
          className="mood-slider"
          required
        />
        <p>Mood Description: {getMoodDescription(moodScore)}</p>

        <h3>Journal Entry</h3>
        <textarea
          placeholder="Write your thoughts here..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="journal-entry"
          required
        />

        <h3>Additional Metrics</h3>
        <div className="metrics">
          <label>
            Sleep Hours:
            <input
              type="number"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              min="0"
              max="24"
              required
            />
          </label>
          <label>
            Water Intake (L):
            <input
              type="number"
              value={waterIntake}
              onChange={(e) => setWaterIntake(Number(e.target.value))}
              min="0"
              required
            />
          </label>
        </div>

        <button onClick={handleLogMood} className="log-button">Log Mood</button>
        <button onClick={() => navigate('/mood-track/previous-report')} className="view-reports-button">
          View Previous Mood Reports
        </button>
        <button onClick={() => setShowWeeklyReport(!showWeeklyReport)} className="toggle-report-button">
          {showWeeklyReport ? 'Hide Weekly Report' : 'Show Weekly Report'}
        </button>
      </div>
      </main>

      {showWeeklyReport && <WeeklyReport />}
      
    </div>
  );
};

export default MoodTracker;
