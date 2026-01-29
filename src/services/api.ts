import axios from "axios";

export const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL || "https://api-restaurante.nael.live",
=======
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
>>>>>>> 3a51e983ebe5b2b1f03b3189ce1ef8e51dfbc28e
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;