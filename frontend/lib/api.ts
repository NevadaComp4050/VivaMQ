//import 'server-only'

import axios from "axios";
import { auth } from "~/auth";

const baseURL =
  process.env.NEXT_PUBLIC_BE_API_URL ||
  "http://localhost:8080/api/v1/production";

const api = axios.create({
  baseURL,
  httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
});

api.interceptors.request.use(async (config) => {
  const session = await auth();

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
  }
  return config;
});

export default api;
