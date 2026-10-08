import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error(
        "[404 Not Found] La URL invocada no existe:",
        error.config?.url,
        "Método:",
        error.config?.method?.toUpperCase(),
        "Base URL:",
        error.config?.baseURL,
      );
    }

    return Promise.reject(error);
  },
);
