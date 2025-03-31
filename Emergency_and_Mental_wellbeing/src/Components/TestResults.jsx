import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/Assessment.css';

export default function TestResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const { score } = location.state || { score: 0 };
    const depressionLevel = getDepressionLevel(score);
    const recommendations = getRecommendations(depressionLevel);

    function getDepressionLevel(score) {
        if (score > 30) return 'Severe depression';
        if (score > 20) return 'Moderate depression';
        return 'Mild depression';
    }

    function getRecommendations(level) {
        switch (level) {
            case 'Severe depression':
                return 'Strongly recommend consulting a mental health professional immediately.';
            case 'Moderate depression':
                return 'Consider speaking with a therapist or counselor.';
            case 'Mild depression':
                return 'Practice self-care and monitor symptoms.';
            default:
                return 'Continue maintaining good mental health practices.';
        }
    }

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token'); // Assuming token from login
            const userId = localStorage.getItem('userId'); // Ensure this is set on login
            if (!userId) {
                alert('User ID not found. Please log in again.');
                navigate('/');
                return;
            }

            const payload = {
                userId,
                date: new Date().toISOString(),
                score,
                depressionLevel,
            };
            console.log('Saving payload:', payload); // Debug log

            const response = await fetch('http://localhost:8080/api/users/test-results/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token || ''}`, // Include token if required
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Test score saved successfully!');
                
            } else {
                throw new Error(result.message || 'Failed to save');
            }
        } catch (error) {
            console.error('Save error:', error); // Debug log
            alert('Error saving results: ' + error.message);
        }
    };

    return (
        <div className="assessment-results">
            <header className="assessment-header">
                <h1>Test Results</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="assessment-button"
                    style={{ position: 'absolute', left: '20px', top: '20px' }}
                >
                    Home
                </button>
            </header>
            <main className="assessment-main">
                <div className="results-card" >
                    <p>Your total score: {score}</p>
                    <p>Depression Level: {depressionLevel}</p>
                    <h3>Recommendations:</h3>
                    <p>{recommendations}</p>
                    <p className="note">Note: This is not a diagnostic tool. Consult a professional.</p>
                    <button onClick={handleSave} className="assessment-button save-button">
                        Save Results
                    </button>
                    <button onClick={() => navigate('/assessment/history')} className="assessment-button history-button">
                        View Test History
                    </button>
                </div>
            </main>
        </div>
    );
}