import { useState } from "react";
import { loginCustomer } from "../services/api";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Customer Login</h1>

      {error && <div style={{ color: "red" }}>{errorMessage}</div>}
      {isLoggedIn && <div style={{ color: "green" }}>Logged in successfully!</div>}

      <form onSubmit={handleFormSubmit}>
        <label>Account Number</label>
        <input
          type="text"
          value={accountNumber}
          onChange={handleAccountNumber}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={handlePassword}
        />

        <button 
        type="submit"
        onClick={() => navigate("/home")}
        >
          Login  
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{ marginTop: 10 }}
        >
          Don't have an account? Register
        </button>
      </form>
    </div>
  );
}
