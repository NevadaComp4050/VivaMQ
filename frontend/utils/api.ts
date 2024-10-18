import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `${process.env.BACKEND_URL}/api/v1/development`,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
