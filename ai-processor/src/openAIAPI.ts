import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { encode } from "gpt-3-encoder";

import dotenv from "dotenv";

function countTokens(prompt: string): number {
  const tokens = encode(prompt);
  return tokens.length;
}

// Load environment variables
dotenv.config();

// question structure
const Question = z.object({
  question_text: z.string(),
  question_category: z.string()
});

// zod API response: array of categories
const QuestionResponse = z.object({
  questions: z.array(Question),
});

// env API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function to prompt OpenAI and parse the response using Zod
async function promptSubUUID(
  prompt: string,
  submission: string,
  uuid: string
): Promise<[string, string]> {
  const tokenLimit = 30000; 
  const totalTokens = countTokens(prompt) + countTokens(submission);

  if (totalTokens > tokenLimit) {
    console.error(`Token limit exceeded. Total tokens: ${totalTokens}, Limit: ${tokenLimit}`);
    return ["Token limit exceeded", uuid];
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Use the appropriate model
      messages: [{ role: "user", content: prompt + "\n\n" + submission }],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    const responseText = response.choices[0].message.content;
    if (responseText != null) {
      return [responseText, uuid];
    } else {
      return ["response error", uuid];
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { promptSubUUID };

// ------------------- debugging --------------------//

const debug = false;
if (debug) {
  (async () => {
    try {
      const response = await promptSubUUID(
        // student submission , prompt used, UUID
        "photosynthesis",
        "please provide three questions to assess my understanding of the text submission",
        "1324"
      );
      if (response) console.log("The response is: ", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
}
