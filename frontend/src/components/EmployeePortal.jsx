import {useState, useEffect} from "react";
import { getAllTransactions, verifyTransaction, submitToSwift } from "../services/api";
import "./CustomStyling.css";

export default function EmployeePortal() {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [verifiedTransactions, setVerifiedTransactions] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [employee, setEmployee] = useState(null);
  const token = localStorage.getItem("token");
  
  const fetchTransactions = async () =>{
    try{
      const res = await getAllTransactions(token);
      setPendingTransactions(res.data.pendingTransactions);
      setVerifiedTransactions(res.data.verifiedTransactions);
    }
    catch(err){
      setError(err.response?.data?.error || "Failed to get transactions");
    }
  };

  useEffect(() => {
    fetchTransactions();

    const storedEmployee = localStorage.getItem("user");
    if (storedEmployee){
      setEmployee(JSON.parse(storedEmployee));
    }
  }, [token]
  );

  const handleVerify = async (id) => {
    try{
      const res = await verifyTransaction(id, token);
      setMessage(res.data.message);
      fetchTransactions();
    }
    catch(err){
      setError(err.response?.data?.error || "Failed to verify transaction");
    }

  };

  const handleSubmitToSwift = async () => {
    try{
      const res = await submitToSwift(token);
      setMessage(res.data.message);
      fetchTransactions();
    }
    catch(err){
      setError(err.response?.data?.error || "Failed to submit to SWIFT");
    }

  };

  return (
    <div className="home-container">
      <h1 className="home-title">Employee Portal</h1>
      {employee && (
        <h2 style={{color: "white"}}>
          Welcome back, {employee.fullName}.</h2>
      )}
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}

      <div className="home-columns">
        <div className="home-table-card">
          <h2>Pending Transactions</h2>
          {pendingTransactions.length === 0 ?(
            <p>No pending transactions</p>
          ) : (
            <table className="transaction-table pending-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Provider</th>
                  <th>Payee</th>
                  <th>SWIFT</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.map((tx) => (
                  <tr key= {tx._id}>
                    <td>{tx.amount}</td>
                    <td>{tx.currency}</td>
                    <td>{tx.provider}</td>
                    <td>{tx.payeeAccount}</td>
                    <td>{tx.swift}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn-primary" onClick={() => handleVerify(tx._id)}>
                        Verify
                      </button>
                    </td>
                  </tr>

                ))}
              </tbody>

            </table>
          )
        }
        </div>

        <div className="home-table-card">
          <h2>Verified Transactions</h2>
          {verifiedTransactions.length === 0 ? (
            <p>No verified transactions</p>
          ): (
            <>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Provider</th>
                  <th>Payee</th>
                  <th>SWIFT</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {verifiedTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{tx.amount}</td>
                    <td>{tx.currency}</td>
                    <td>{tx.provider}</td>
                    <td>{tx.payeeAccount}</td>
                    <td>{tx.swift}</td>
                    <td>{tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn-primary" style={{marginTop: "20px"}} onClick={handleSubmitToSwift}>
                Submit all to SWIFT
            </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
