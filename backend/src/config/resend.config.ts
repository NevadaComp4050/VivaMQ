import { config } from 'dotenv';

config();

export const resendConfig = {
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.RESEND_FROM_EMAIL,
};