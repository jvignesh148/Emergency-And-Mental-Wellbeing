import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Assessment.css';

export default function SuicidalUrges() {
    const [scores, setScores] = useState({
        question1: 0, question2: 0, question3: 0, question4: 0, question5: 0,
        question6: 0, question7: 0, question8: 0, question9: 0, question10: 0,
    });
    const navigate = useNavigate();

    const questions = [
        "Do you have any suicidal thoughts?",
        "Would you like to end your life?",
        "Do you have a plan for harming yourself?",
        "Do you often feel hopeless or empty?",
        "Do you struggle to find pleasure in activities you once enjoyed?",
        "Do you have difficulty concentrating or making decisions?",
        "Do you feel constantly tired or have low energy?",
        "Have you been experiencing changes in appetite or weight?",
        "Do you feel anxious or restless frequently?",
        "Do you have trouble sleeping or sleep too much?"
    ];

    const handleChange = (question, value) => {
        setScores(prev => ({ ...prev, [question]: parseInt(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        navigate('/assessment/results', { state: { score: totalScore } });
    };

    return (
        <div className="assessment-questionnaire">
            <header className="assessment-header">
                <h1>Mental Health Assessment</h1>
            </header>
            <main className="assessment-main">
                <form onSubmit={handleSubmit} className="questionnaire-form">
                    {questions.map((question, index) => (
                        <div key={index} className="question">
                            <p>{index + 1}. {question}</p>
                            <div className="radio-group">
                                {[0, 1, 2, 3, 4].map(value => (
                                    <label key={value} className="radio-label">
                                        <input
                                            type="radio"
                                            name={`question${index + 1}`}
                                            value={value}
                                            checked={scores[`question${index + 1}`] === value}
                                            onChange={(e) => handleChange(`question${index + 1}`, e.target.value)}
                                        />
                                        {value}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit" className="assessment-button">
                        Submit
                    </button>
                </form>
            </main>
        </div>
    );
}