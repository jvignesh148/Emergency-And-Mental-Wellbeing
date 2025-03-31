import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Assessment.css';

export default function AssessmentLanding() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/assessment/suicidal-urges');
    };

    return (
        <div className="assessment-landing">
            <header className="assessment-header">
                <h1>Assess Your Mental Well-being</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="assessment-button"
                    style={{ position: 'absolute', left: '20px', top: '20px' }}
                >
                    Home
                </button>
                <button
                    onClick={() => navigate('/assessment/history')}
                    className="assessment-button"
                    style={{ position: 'absolute', right: '20px', top: '20px' }}
                >
                    Test Results
                </button>
            </header>
            <main className="assessment-main">
                <div className="assessment-card">
                    <img src="test.jpeg" className="assessment-image" alt="Mental Health Assessment" />
                    <p className="assessment-description">
                        Take a simple, reliable test to understand your emotional state. MindCheck helps you gain insight into your thoughts, feelings, and overall mental well-being.
                    </p>
                    <button onClick={handleStart} className="assessment-button">
                        Start Your Assessment
                    </button>
                </div>
            </main>
        </div>
    );
}