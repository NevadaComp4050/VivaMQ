import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const OptimizedPrompt = z.object({
  optimized_prompt: z.string(),
  configuration_params: z.record(z.unknown()),
});

const generatePrompt = (
  originalPrompt: string,
  configParams: Record<string, unknown>
) => `
Optimize the following prompt and suggest configuration parameters for AI tools:

Original Prompt:
${originalPrompt}

Configuration Parameters:
${JSON.stringify(configParams, null, 2)}

Provide an optimized version of the prompt and suggest any changes to the configuration parameters.
`;

async function optimizePromptAndConfig(
  originalPrompt: string,
  configParams: Record<string, unknown>
): Promise<typeof OptimizedPrompt> {
  try {
    const prompt = generatePrompt(originalPrompt, configParams);
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(OptimizedPrompt, "OptimizedPrompt"),
    });

    const result = response.choices[0].message.content;
    if (result) {
      return JSON.parse(result);
    } else {
      throw new Error("Failed to optimize prompt and configuration");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { optimizePromptAndConfig };
