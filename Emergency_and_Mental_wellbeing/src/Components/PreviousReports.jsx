import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/PreviousReports.css';

const PreviousReports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/mood/entries/user123');
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/mood/delete/${id}`);
      setReports(reports.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <div className="previous">
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
                    <li><a href='/'>Logout</a></li>
                </ul>
            </nav>
        </header>
          <div className="previous-reports">
      <h2>Previous Mood Reports</h2>
      <button onClick={() => navigate('/mood-track')} className="back-button">
        Back to Mood Tracker
      </button>
      <div className="reports-list">
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <p><strong>Date:</strong> {report.date}</p>
              <p><strong>Mood Score:</strong> {report.moodScore}</p>
              <p><strong>Mood Description:</strong> {report.moodDescription}</p>
              <p><strong>Journal Entry:</strong> {report.journalEntry || 'N/A'}</p>
              <p><strong>Sleep Hours:</strong> {report.sleepHours}</p>
              <p><strong>Water Intake:</strong> {report.waterIntake} L</p>
              <button onClick={() => handleDelete(report.id)} className="delete-button">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default PreviousReports;
