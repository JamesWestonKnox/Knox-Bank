import { useState, useEffect } from "react";
import { getTransactions, createTransaction } from "../services/api";
import "./CustomStyling.css";
import logo from "../assets/logo.png";

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
    const currencies = ["ZAR","USD", "EUR","GBP","JPY","AUD","CAD","CNY"];
    const providers = ["FNB","ABSA","Capitec","Standard Bank","Nedbank","Investec","TymeBank","Discovery Bank","Old Mutual Bank"
];

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
 <div className="home-container">
  <h1 className="home-title">Welcome to KNOX bank</h1>

  <div className="home-columns">
    <div className="home-form-card">
      <h2>Create Transaction</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="JPY">JPY</option>
            <option value="AUD">AUD</option>
            <option value="CAD">CAD</option>
            <option value="CNY">CNY</option>
          </select>
        </div>

        <div className="form-group">
          <label>Provider</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="FNB">FNB</option>
            <option value="ABSA">ABSA</option>
            <option value="Capitec">Capitec</option>
            <option value="Standard Bank">Standard Bank</option>
            <option value="Nedbank">Nedbank</option>
            <option value="Investec">Investec</option>
            <option value="TymeBank">TymeBank</option>
            <option value="Discovery Bank">Discovery Bank</option>
            <option value="Old Mutual Bank">Old Mutual Bank</option>
          </select>
        </div>

        <div className="form-group">
          <label>Payee Account</label>
          <input type="text" value={payeeAccount} onChange={(e) => setPayeeAccount(e.target.value)} />
        </div>

        <div className="form-group">
          <label>SWIFT Code</label>
          <input type="text" value={swift} onChange={(e) => setSwift(e.target.value)} />
        </div>

        <button type="submit" className="btn-primary">Create Transaction</button>
      </form>
    </div>

    <div className="home-table-card">
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Amount</th><th>Currency</th><th>Provider</th>
              <th>Payee</th><th>SWIFT</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
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
  </div>
</div>


  );
}