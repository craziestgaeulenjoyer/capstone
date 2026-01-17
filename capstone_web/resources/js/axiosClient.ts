import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

/**
 * Attach ONLY customer token (auth-related actions)
 */
authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("customer_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Sanctum CSRF handling
 */
authClient.interceptors.request.use(async (config) => {
  if (["post", "put", "patch", "delete"].includes(config.method || "")) {
    await authClient.get("/sanctum/csrf-cookie");
  }
  return config;
});

export default authClient;
