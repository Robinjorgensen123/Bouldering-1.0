import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = authToken ?? localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
