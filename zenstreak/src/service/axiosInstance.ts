import { BASE_URL } from "@/lib/config";
import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors globally
        if (error.response?.status === 401) {
            console.error("Unauthorized");
            // Optional: redirect to login page
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;