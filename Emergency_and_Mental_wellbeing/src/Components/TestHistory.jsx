import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Assessment.css';

export default function TestHistory() {
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    setError('User ID not found. Please log in.');
                    navigate('/login');
                    return;
                }
                const response = await fetch(`http://localhost:8080/api/users/test-results?userId=${userId}`, {
                    headers: { 'Authorization': `Bearer ${token || ''}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setHistory(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch history');
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchHistory();
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/users/test-results/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token || ''}` },
            });
            if (response.ok) {
                setHistory(history.filter(item => item.id !== id));
                alert('Test result deleted successfully!');
            } else {
                throw new Error('Failed to delete');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="assessment-history">
            <header className="assessment-header">
                <h1>Test History</h1>
                <button
                    onClick={() => navigate('/home')}
                    className="assessment-button"
                    style={{ position: 'absolute', left: '20px', top: '20px' }}
                >
                    Home
                </button>
                <button
                    onClick={() => navigate('/assessment')}
                    className="assessment-button"
                    style={{ position: 'absolute', right: '20px', top: '20px' }}
                >
                    Take New Test
                </button>
            </header>
            <main className="assessment-main">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {history.length === 0 ? (
                    <p>No test history available.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {history.map(item => (
                            <div
                                key={item.id}
                                className="history-card"
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}
                            >
                                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                                <p>Score: {item.score}</p>
                                <p>Depression Level: {item.depressionLevel}</p>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="assessment-button delete-button"
                                >
                                    Delete Test Result
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}