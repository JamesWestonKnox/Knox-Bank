import { useState, useEffect } from "react";
import { getTransactions, createTransaction } from "../services/api";

export default function Home() {
  //Retrieving the input values from the user
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ZAR");
  const [provider, setProvider] = useState("FNB");
  const [payeeAccount, setPayeeAccount] = useState("");
  const [swift, setSwift] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  //Retrieving the jwt token from storage
  const token = localStorage.getItem("token");

  //Retrieving existing transactions from the user
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions(token);
        setTransactions(res.data.transactions);
      } catch (err) {
        //Displays error if api fails
        setError(err.response?.data?.error || "Failed to fetch transactions");
      }
    };
    fetchTransactions();
  }, [token]);


  //Creating a new transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    //Input validation
    const accountPattern = /^[0-9]{10,12}$/;
    const swiftPattern = /^[A-Za-z0-9]{8,11}$/;
    const currencies = ["ZAR", "USD", "EUR"];
    const providers = ["FNB", "ABSA", "Capitec", "Standard Bank"];

    if (!amount || !payeeAccount || !swift) {
      setError("All fields must be filled out");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Amount must be a number greater than 0");
      return;
    }

    if (!currencies.includes(currency)) {
      setError("Currency has to be one of the currencies provided");
      return;
    }

    if (!providers.includes(provider)) {
      setError("Provider must be a provider provided");
      return;
    }

    if (!accountPattern.test(payeeAccount)) {
      setError("Payee account must be 10–12 digits");
      return;
    }

    if (!swiftPattern.test(swift)) {
      setError("SWIFT code must be 8–11 alphanumeric characters");
      return;
    }

    //Calling api to create transaction
    try {
      const res = await createTransaction({ amount, currency, provider, payeeAccount, swift }, token);
      //Adding the new transaction
      setTransactions([res.data.transaction, ...transactions]);
      //Success message
      setMessage("Transaction created successfully!");
      //Reset form fields
      setAmount(""); setPayeeAccount(""); setSwift(""); setCurrency("ZAR"); setProvider("FNB");

    } catch (err) {
      setError(err.response?.data?.error || "Transaction failed");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h1>Home</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />

        <select value={currency} onChange={e => setCurrency(e.target.value)}>
          <option value="ZAR">ZAR</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <select value={provider} onChange={e => setProvider(e.target.value)}>
          <option value="FNB">FNB</option>
          <option value="ABSA">ABSA</option>
          <option value="Capitec">Capitec</option>
          <option value="Standard Bank">Standard Bank</option>
        </select>

        <input type="text" placeholder="Payee Account" value={payeeAccount} onChange={e => setPayeeAccount(e.target.value)} />
        <input type="text" placeholder="SWIFT Code" value={swift} onChange={e => setSwift(e.target.value)} />

        <button type="submit">Create Transaction</button>
      </form>

      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border="1" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Amount</th><th>Currency</th><th>Provider</th><th>Payee</th><th>SWIFT</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t._id}>
                <td>{t.amount}</td><td>{t.currency}</td><td>{t.provider}</td>
                <td>{t.payeeAccount}</td><td>{t.swift}</td><td>{t.status}</td>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
