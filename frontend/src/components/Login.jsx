import { useState } from "react";
import { loginCustomer } from "../services/api"; // make sure you have this function

export default function LoginForm() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Regex for validation
  const accReg = /^[0-9]{10,12}$/;
  const passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!accountNumber || !password) {
      setError(true);
      setErrorMessage("All fields must be filled out");
      setIsLoggedIn(false);
      return;
    }

    if (!accReg.test(accountNumber)) {
      setError(true);
      setErrorMessage("Account number must be 10–12 digits long");
      return;
    }

    if (!passwordReg.test(password)) {
      setError(true);
      setErrorMessage("Password must be at least 8 chars, 1 capital, 1 number, 1 special char");
      return;
    }

    try {
      const data = await loginCustomer({ accountNumber, password });

      // Store JWT token
      localStorage.setItem("token", data.token);

      setIsLoggedIn(true);
      setError(false);
      setErrorMessage("");

      setAccountNumber("");
      setPassword("");
    } catch (err) {
      setError(true);
      setIsLoggedIn(false);
      setErrorMessage("Login failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Customer Login</h1>

      {error && <div style={{ color: "red" }}>{errorMessage}</div>}
      {isLoggedIn && <div style={{ color: "green" }}>Successfully logged in!</div>}

      <form>
        <label>Account Number</label>
        <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" onClick={handleFormSubmit}>Login</button>
      </form>
    </div>
  );
}
