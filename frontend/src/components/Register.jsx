import { useState } from "react";
import { registerCustomer } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {

  const navigate = useNavigate();
  // Registration form field states
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  // States for form submission and error feedback
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Regex patterns for input validation
  const nameReg = /^[a-zA-Z ]{3,30}$/
  const idReg = /^[0-9]{13}$/
  const accReg = /^[0-9]{10,12}$/
  const passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  // Handlers for fields on input event
  const handleFullName = (input) => {setFullName(input.target.value)};
  const handleIdNumber = (input) => {setIdNumber(input.target.value)};
  const handleAccountNumber = (input) => {setAccountNumber(input.target.value)};
  const handlePassword = (input) => {setPassword(input.target.value)};

  // Function to handle form submission
  const handleFormSubmit = async (e) => {

    // Ensures form does not refresh and lose state
    e.preventDefault();

    // Checks if all fields are filled out, else returns error message
    if (!fullName || !idNumber || !accountNumber || !password){
      setError(true);
      setErrorMessage("All fields must be filled out");
      setIsRegistered(false);
      return;
    }

    // Tests inputs against Regex patterns and returns error messages
    if (!nameReg.test(fullName)) {
      setError(true);
      setErrorMessage("Full name must be between 3 - 30 letters");
      return;
    }
    if (!idReg.test(idNumber)) {
      setError(true);
      setErrorMessage("ID number must be 13 digits long");
      return;
    }
    if (!accReg.test(accountNumber)) {
      setError(true);
      setErrorMessage("Account number must be between 10-12 digits long");
      return;
    }
    if (!passwordReg.test(password)) {
      setError(true);
      setErrorMessage("Password must contain 8 characters, including 1 Capital letter, 1 special character and 1 number");
      return;
    }

    // If validations pass, registers and clears form fields
    try {
      await registerCustomer({fullName, idNumber, accountNumber, password});
      setIsRegistered(true);
      setError(false);
      setErrorMessage("");

      setFullName("");
      setIdNumber("");
      setAccountNumber("");
      setPassword("");
    } catch (error) {
      setError(true);
      setIsRegistered(false);
      setErrorMessage("Registration failed");
    }
  };

  // Layout of registration success message
  const successMessageDisplay = () => (
    <div style={{ display: isRegistered ? "" : "none", color: "green" }}>
      <h1>Successfully registered!</h1>
    </div>
  );

  // Layout of error message
  const errorMessageDisplay = () => (
    <div style={{ display: error ? "" : "none", color: "red" }}>
      <h1>{errorMessage}</h1>
    </div>
  );

  // Form HTML layout
  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Customer Registration</h1>

      {errorMessageDisplay()}
      {successMessageDisplay()}

      <form>
        <label>Full Name</label>
        <input type="text" value={fullName} onChange={handleFullName} />

        <label>ID Number</label>
        <input type="text" value={idNumber} onChange={handleIdNumber} />

        <label>Account Number</label>
        <input type="text" value={accountNumber} onChange={handleAccountNumber} />

        <label>Password</label>
        <input type="password" value={password} onChange={handlePassword} />

        <button type="submit" onClick={handleFormSubmit}>Register</button>

        <button type="button" onClick={() => navigate("/login")}>
        Already have an account? Login
      </button>

      </form>
    </div>
  );
}

