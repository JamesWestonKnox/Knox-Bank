import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginEmployee } from "../services/api";
import "./CustomStyling.css";
import logo from "../assets/logo.png";

export default function EmployeeLoginForm() {
  const navigate = useNavigate();

  // Employee login field states
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");

  // States for success/error
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Regex patterms
  const empReg = /^[eE][mM][pP]\d{4}$/;
  const passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  // Handlers for inputs
  const handleEmployeeNumber = (e) => setEmployeeNumber(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Empty fields check
    if (!employeeNumber || !password) {
      setError(true);
      setErrorMessage("Please fill out all fields");
      setIsLoggedIn(false);
      return;
    }

    // Validate employee number against Regex
    if (!empReg.test(employeeNumber)) {
      setError(true);
      setErrorMessage("Please format employee number correctly");
      return;
    }

    // Validate password against Regex
    if (!passwordReg.test(password)) {
      setError(true);
      setErrorMessage(
        "Password must contain 8 characters, 1 Capital letter, 1 special character, and 1 number"
      );
      return;
    }

    // Call backend API
    try {
      const data = await loginEmployee({ employeeNumber, password });
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setError(false);
      setErrorMessage("");
      navigate("/employee-portal");

      // Clear fields
      setEmployeeNumber("");
      setPassword("");

      // Navigation
    } catch (err) {
      setError(true);
      setIsLoggedIn(false);
      setErrorMessage(err.message || "Login failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={logo} alt="Knox Bank" className="register-logo" />
        <h1 className="register-title">Employee Login</h1>
        {error && <div className="error-message">{errorMessage}</div>}
        {isLoggedIn && (
          <div className="success-message">Logged in successfully!</div>
        )}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Employee Number</label>
            <input
              type="text"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
