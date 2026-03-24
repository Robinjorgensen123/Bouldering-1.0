import axios from "axios";

let authToken: string | null = null;

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: apiBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
