import axios from 'axios';
import { cookies } from 'next/headers';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1/development';

export const getServerApiClient = () => {
  const token = cookies().get('jwt');

  const apiClient = axios.create({
    baseURL,
    headers: {
      Authorization: token ? `Bearer ${token.value}` : '',
    },
  });

  return apiClient;
};
