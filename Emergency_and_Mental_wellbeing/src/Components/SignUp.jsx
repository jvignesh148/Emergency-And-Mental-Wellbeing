import React, { useState } from 'react';
import '../Styles/SignUp.css';
import { useNavigate, Link } from 'react-router-dom';

export const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [data, setData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        securityQuestion: "",
        securityAnswer: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        const { firstname, lastname, email, password, securityQuestion, securityAnswer } = data;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Validate password before sending to backend

        if (!firstname) {
            alert("Please enter your First Name");
            return;
        }
        if (!lastname) {
            alert("Please enter your Last Name");
            return;
        }
        if (!email) {
            alert("Please enter your Email ID");
            return;
        }
        if (!password) {
            alert("Please enter your Password");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@$!%*?&)");
            return;
        }

        if (!securityQuestion) {
            alert("Please enter a Security Question");
            return;
        }
        if (!securityAnswer) {
            alert("Please enter a Security Answer");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            let result;
            try {
                // Clone the response to read both JSON and text if needed
                const clonedResponse = response.clone();
                result = await clonedResponse.json();
            } catch (jsonError) {
                // If JSON parsing fails, read the raw text for debugging
                const text = await response.text();
                console.error('Raw response (non-JSON):', text);
                throw new Error(`Invalid JSON response: Received HTML or non-JSON data - ${text.substring(0, 100)}...`);
            }

            if (!response.ok) {
                alert(result.message || "Signup failed");
                return;
            }         

            alert(result.message); // "User registered successfully!"
            setError('');
            navigate("/login");
        } catch (error) {
            console.error('Fetch error details:', error);
            alert(error.message || "Server error—check if backend is running.");
        }
    };

    return (
        <div className="signup_page">
                <div className="SignUp_section">
                    <form onSubmit={handleSubmit}>
                        <h2>Create Your Account</h2>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <label htmlFor="fname">First Name</label>
                        <input type="text" name="firstname" value={data.firstname} onChange={handleChange} />
                        <label htmlFor="lname">Last Name</label>
                        <input type="text" name="lastname" value={data.lastname} onChange={handleChange}  />
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={data.email} onChange={handleChange}  />
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={data.password} onChange={handleChange}  />
                        <label htmlFor="securityQuestion">Security Question</label>
                        <input 
                            type="text" 
                            name="securityQuestion" 
                            value={data.securityQuestion} 
                            onChange={(e) => setData((prevData) => ({ ...prevData, securityQuestion: e.target.value }))} 
                            placeholder="e.g., What was your first pet's name?"
                        />
                        <label htmlFor="securityAnswer">Security Answer</label>
                        <input 
                            type="text" 
                            name="securityAnswer" 
                            value={data.securityAnswer} 
                            onChange={(e) => setData((prevData) => ({ ...prevData, securityAnswer: e.target.value }))}
                        />
                        <button type="submit">Register</button>
                    </form>
                    <div className="signup_option">
                        Already have an account? <Link to="/">Log in</Link>
                    </div>
                </div>
        </div>
    );
};
