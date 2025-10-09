import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:4000/api",
  withCredentials: true,
});

export const registerCustomer = async (data) => {
  return await API.post("/customer/register", data);
};

export async function loginCustomer(credentials) {
  const res = await fetch("https://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Login failed");
  }

  return await res.json();
}

export const getTransactions = async (token) => {
  return await API.get("/transaction", { headers: { Authorization: `Bearer ${token}` } });
};

export const createTransaction = async (data, token) => {
  return await API.post("/transaction", data, { headers: { Authorization: `Bearer ${token}` } });
};