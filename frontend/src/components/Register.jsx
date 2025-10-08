import { useState } from "react";
import { registerCustomer } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    email: "",
});

const [message, setMessage] = useState("");

const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const validateInput = () => {
    const nameRegex = /^[a-zA-Z ]{3,50}$/;
    const idRegex = /^[0-9]{13}$/;
    const accRegex = /^[0-9]{10,12}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passRegex = /^.{6,}$/;

    if (!nameRegex.test(formData.fullName)) return "Invalid full name";
    if (!idRegex.test(formData.idNumber)) return "Invalid ID number";
    if (!accRegex.test(formData.accountNumber)) return "Invalid account number";
    if (!emailRegex.test(formData.email)) return "Invalid email";
    if (!passRegex.test(formData.password)) return "Password too short";
    return null;
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateInput();
    if (error) {
      setMessage(error);
      return;
    }

    try {
      const res = await registerCustomer(formData);
      setMessage(res.data.message || "Registration successful!");
      setFormData({ fullName: "", idNumber: "", accountNumber: "", password: "", email: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
};

return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Customer Registration</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="idNumber"
          placeholder="ID Number"
          value={formData.idNumber}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="accountNumber"
          placeholder="Account Number"
          value={formData.accountNumber}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;