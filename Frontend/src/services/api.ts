import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};
// create an axios instance with the base URL of the backend API
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});
// Handles token in headers for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
