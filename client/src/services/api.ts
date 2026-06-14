import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.subscriptionExpired === true
    ) {
      // Admin panel pe ye nahi hona chahiye
      if (!window.location.pathname.startsWith("/admin")) {
        window.location.href = "/subscription-expired";
      }
    }
    return Promise.reject(error);
  }
);
 

export default api;
