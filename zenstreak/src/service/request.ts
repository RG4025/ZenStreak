import {
    AxiosRequestConfig,
    AxiosResponse,
} from "axios";
import axiosInstance from "./axiosInstance";

class RequestHandler {
    async get<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await axiosInstance.get(url, config);

        return response.data;
    }

    async post<T>(
        url: string,
        payload?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await axiosInstance.post(url, payload, config);

        return response.data;
    }

    async put<T>(
        url: string,
        payload?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await axiosInstance.put(url, payload, config);

        return response.data;
    }

    async patch<T>(
        url: string,
        payload?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await axiosInstance.patch(url, payload, config);

        return response.data;
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response: AxiosResponse<T> =
            await axiosInstance.delete(url, config);

        return response.data;
    }
}

export default new RequestHandler();