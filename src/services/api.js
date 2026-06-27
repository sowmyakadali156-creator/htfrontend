import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://habittracker-of6r.onrender.com/api";

export const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});