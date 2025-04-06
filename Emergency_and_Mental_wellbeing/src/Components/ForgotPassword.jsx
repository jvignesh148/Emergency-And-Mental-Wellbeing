import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/ForgotPassword.css"; // Assuming you'll create this CSS file

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: security question, 3: new password
  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  

  // Step 1: Submit email to get security question
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your Email ID");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/users/forgot-password", { email });
      setSecurityQuestion(response.data.securityQuestion);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error contacting server");
    }
  };

  // Step 2: Verify security answer
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!securityAnswer) {
      alert("Please enter your Security Answer");
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/users/verify-security-answer", {
        email,
        answer: securityAnswer,
      });
      if (response.data.message === "Answer verified successfully") {
        setStep(3);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error verifying answer");
    }
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert("Please enter your New Password");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      alert("Password must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character (@$!%*?&)");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/users/reset-password", {
        email,
        password: newPassword,
      });
      alert(response.data.message);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      alert(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-section">
        <h2>Forgot Password</h2>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <label htmlFor="email">Enter your email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Get Security Question</button>
          </form>
        )}

        {/* Step 2: Security Question */}
        {step === 2 && (
          <form onSubmit={handleAnswerSubmit}>
            <label>{securityQuestion}</label>
            <input
              type="text"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
            <button type="submit">Verify Answer</button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <label htmlFor="newPassword">Enter new password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        <div className="back-to-login">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
