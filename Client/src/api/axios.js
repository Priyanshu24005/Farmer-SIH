import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function getAuthHeaders() {
  const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const adminToken = localStorage.getItem("admin-token");
  const farmerToken = localStorage.getItem("farmer-token");

  if (isAdmin && adminToken) {
    return { Authorization: 'Bearer ' + adminToken };
  }
  if (!isAdmin && farmerToken) {
    return { Authorization: 'Bearer ' + farmerToken };
  }
  return {};
}

api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    if (Object.keys(headers).length > 0) {
      Object.assign(config.headers, headers);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong. Please try again.";

    if (status === 401) {
      toast.error("Session expired. Please log in again.");
      const isAdmin = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
      if (isAdmin) {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-role");
        localStorage.removeItem("admin-user");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("farmer-token");
        localStorage.removeItem("farmer-role");
        localStorage.removeItem("farmer-profile");
        localStorage.removeItem("farmer-sih-profile");
        window.location.href = "/farmer/login";
      }
    } else if (status === 404) {
      toast.error("Not found: " + message);
    } else if (status >= 500) {
      toast.error("Server error — try again in a moment.");
    } else if (!error.response) {
      toast.error("Can't reach the server. Is the backend running?");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
