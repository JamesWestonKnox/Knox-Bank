import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export const registerCustomer = async (data) => {
  return await API.post("customer/register", data);
};