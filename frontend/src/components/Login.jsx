import { useState } from "react";
import { loginCustomer } from "../services/api";

export default function LoginForm() {
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginCustomer({ accountNumber, password });
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      setError("");
    } catch (err) {
      setError(err.message);
      setIsLoggedIn(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Account Number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoggedIn && <p style={{ color: "green" }}>Logged in successfully!</p>}
    </div>
  );
}
