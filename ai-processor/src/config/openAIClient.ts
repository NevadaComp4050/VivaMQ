import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

export default openAIClient;