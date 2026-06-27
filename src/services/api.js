import axios from "axios";

export const API = axios.create({
  baseURL: "https://habittracker-of6r.onrender.com/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});