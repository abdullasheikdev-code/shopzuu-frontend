import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = [
  "/auth/",
  "/categories",
  "/products/featured",
  "/products/public/",
  "/products/search",
];

api.interceptors.request.use((config) => {
  const url = config.url || "";

  const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
    url.includes(endpoint)
  );

  if (!isPublicEndpoint) {
    const token = Cookies.get("shopzuu_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";

    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    if (error.response?.status === 401 && !isPublicEndpoint) {
      Cookies.remove("shopzuu_token");
      Cookies.remove("shopzuu_user");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;