import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import '../Styles/WeeklyReport.css';

const WeeklyReport = () => {
  const [weeklyReport, setWeeklyReport] = useState(null);

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/mood/weekly-report/user123');
        setWeeklyReport(response.data);
      } catch (error) {
        console.error('Error fetching weekly report:', error);
      }
    };
    fetchWeeklyReport();
  }, []);

  if (!weeklyReport || !weeklyReport.moodTrend || !weeklyReport.dates || weeklyReport.moodTrend.length === 0) {
    return <p>No mood entries found for the last 7 days.</p>;
  }

  // Combine moodTrend and dates into the format required by Recharts
  const data = weeklyReport.moodTrend.map((score, index) => {
    // Safety check: Ensure dates[index] exists
    if (!weeklyReport.dates[index]) {
      return {
        date: `Unknown Date ${index + 1}`,
        mood: score,
      };
    }
    const [year, month, day] = weeklyReport.dates[index].split('-'); // Split the date (e.g., "2025-03-22")
    const formattedDate = `${month}/${day}/${year}`; // Format as MM/DD/YYYY
    return {
      date: formattedDate,
      mood: score,
    };
  });

  return (
    <div className="weekly-report">
      <h2>Weekly Mood Report</h2>
      <LineChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 10]} />
        <Tooltip />
        <Line type="monotone" dataKey="mood" stroke="#8884d8" />
      </LineChart>
      <h3>Recommendations</h3>
      <p>{weeklyReport.recommendation}</p>
    </div>
  );
};

export default WeeklyReport;