import axios from "axios";

const createApiClient = (accessToken: string | undefined) => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  apiClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  return apiClient;
};

export default createApiClient;