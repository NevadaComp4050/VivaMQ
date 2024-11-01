import axios from "axios";

const createApiClient = (accessToken: string | undefined) => {
  const baseURL =
    process.env.NEXT_PUBLIC_BE_API_URL ||
    "http://localhost:8080/api/v1/production";

  const apiClient = axios.create({
    baseURL,
    httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    withCredentials: true,
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
