import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { z } from 'zod';
const OpenAIApi = require("openai");

// question structure
const Question = z.object({
  question_text: z.string(),
});

// idk copied off Deb
const Category = z.object({
  category_name: z.string(),
  questions: z.array(Question),
});

// zod API response: array of categories
const QuestionResponse = z.object({
  categories: z.array(Category),
});

// env API key
const client = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// function to prompt OpenAI and parse the response using Zod
async function promptString(prompt: string, uuid: string): Promise<[string, string]> {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o", // Use the appropriate model
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = response.choices[0].message.content;

    return [responseText, uuid];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//mediator between OpenAI API and the interface for RabbitMQ
async function parseMe(toPrompt: string, uuid: string): Promise<[string, string]> {
  try {
    const ret = await promptString(toPrompt, uuid);
    if (ret) {
      //console.log(ret[0], "UUID:", ret[1]);
      return ret;  // return API response
    }
    return ['error', uuid];  // Default return in case of no response
  } catch (error) {
    console.error("Error:", error);
    return ['Error occurred', uuid];  // Return an error string if needed
  }
}

export { parseMe };
