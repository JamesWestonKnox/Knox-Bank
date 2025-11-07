import { useState } from "react";
import { loginCustomer } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./CustomStyling.css";
import logo from "../assets/logo.png";

export default function LoginForm() {
  const navigate = useNavigate();

  // Login field states
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  // States for success/error
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Regex patterns
  const accReg = /^[0-9]{10,12}$/;
  const passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  // Handlers for inputs
  const handleAccountNumber = (e) => setAccountNumber(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Empty fields check
    if (!accountNumber || !password) {
      setError(true);
      setErrorMessage("All fields must be filled out");
      setIsLoggedIn(false);
      return;
    }

    // Regex validation
    if (!accReg.test(accountNumber)) {
      setError(true);
      setErrorMessage("Account number must be 10–12 digits");
      return;
    }

    if (!passwordReg.test(password)) {
      setError(true);
      setErrorMessage(
        "Password must contain 8 characters, 1 Capital letter, 1 special character, and 1 number"
      );
      return;
    }

    // Call backend API
    try {
      const data = await loginCustomer({ accountNumber, password });
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setError(false);
      setErrorMessage("");
      navigate("/home");

      // Clear fields
      setAccountNumber("");
      setPassword("");

      // navigation
    } catch (err) {
      setError(true);
      setIsLoggedIn(false);
      setErrorMessage(err.message || "Login failed");
    }
  };

  return (
    <div className="register-container">
      <div className="cards-wrapper">
        <div className="register-card">
          <img src={logo} alt="Knox Bank" className="register-logo" />
          <h1 className="register-title">Customer Login</h1>

          {error && <div className="error-message">{errorMessage}</div>}
          {isLoggedIn && (
            <div className="success-message">Logged in successfully!</div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
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

            <button
              type="button"
              className="btn-link"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </button>
          </form>
        </div>
        <div className="register-card employee-card">
          <h1 className="register-title">Employee Login</h1>
          <p>Staff access only</p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/employee-login")}
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { loginCustomer } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./CustomStyling.css";
import logo from "../assets/logo.png";

export default function LoginForm() {
  const navigate = useNavigate();

  // Login field states
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  // States for success/error
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Regex patterns
  const accReg = /^[0-9]{10,12}$/;
  const passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  // Handlers for inputs
  const handleAccountNumber = (e) => setAccountNumber(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Empty fields check
    if (!accountNumber || !password) {
      setError(true);
      setErrorMessage("All fields must be filled out");
      setIsLoggedIn(false);
      return;
    }

    // Regex validation
    if (!accReg.test(accountNumber)) {
      setError(true);
      setErrorMessage("Account number must be 10–12 digits");
      return;
    }

    if (!passwordReg.test(password)) {
      setError(true);
      setErrorMessage(
        "Password must contain 8 characters, 1 Capital letter, 1 special character, and 1 number"
      );
      return;
    }

    // Call backend API
    try {
      const data = await loginCustomer({ accountNumber, password });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setError(false);
      setErrorMessage("");
      navigate("/home");

      // Clear fields
      setAccountNumber("");
      setPassword("");

      // navigation
    } catch (err) {
      setError(true);
      setIsLoggedIn(false);
      setErrorMessage(err.message || "Login failed");
    }
  };

  return (
    <div className="register-container">
      <div className="cards-wrapper">
        <div className="register-card">
          <img src={logo} alt="Knox Bank" className="register-logo" />
          <h1 className="register-title">Customer Login</h1>

          {error && <div className="error-message">{errorMessage}</div>}
          {isLoggedIn && (
            <div className="success-message">Logged in successfully!</div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
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

            <button
              type="button"
              className="btn-link"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Register
            </button>
          </form>
        </div>
        <div className="register-card employee-card">
          <h1 className="register-title">Employee Login</h1>
          <p>Staff access only</p>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/employee-login")}
          >
            Employee Login
          </button>
        </div>
      </div>
    </div>
  );
}
