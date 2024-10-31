import axios from "axios";

const createApiClient = (accessToken: string | undefined) => {
  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BE_API_URL,
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
  });

  apiClient.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // cors 
      config.headers["Access-Control-Allow-Origin"] = "*";
    }
    config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  });

  return apiClient;
};

export default createApiClient;