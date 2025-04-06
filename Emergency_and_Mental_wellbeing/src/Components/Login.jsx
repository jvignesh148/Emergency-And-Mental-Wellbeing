import React, { useState } from 'react';
import '../Styles/Login.css';
import { useNavigate, Link } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logindata, setLogindata] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogindata({ ...logindata, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const { email, password } = logindata;

        if (!email) {
            alert("Please enter your Email ID");
            navigate("/");
            return;
        }

        if (!password) {
            alert("Please enter your Password");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logindata),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Login failed");
            }
            if (result.message === "Login successful!") {
                localStorage.setItem('userId', result.userId);
                alert("Login successful!");
                navigate("/home");
            } else {
                alert(result.message || "Login failed");
            }
        } catch (error) {
            alert(error.message || "Server error—check if backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='login_page'>
        <div className="Login_section">
            <h2>Welcome Back</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" name="email" value={logindata.email} onChange={handleChange} />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" value={logindata.password} onChange={handleChange} />
                <button type="submit">
                     Log In
                </button>
            </form>
            <div className="Login_option">
                <a href="/forgot-password">Forgot password?</a> <span>|</span> <a href="/signup">Create an account</a>
            </div>
        </div>
        </div>
    );
};
