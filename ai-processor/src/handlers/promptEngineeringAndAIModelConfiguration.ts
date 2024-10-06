import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateOptimizedPromptSuggestionPrompt } from "../utilities/promptGenerators";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const OptimizedPrompt = z.object({
  optimized_prompt: z.string(),
  configuration_params: z.record(z.unknown()),
});

async function optimizePromptAndConfig(
  openAIClient: OpenAI,
  {
    originalPrompt,
    configParams,
  }: {
    originalPrompt: string;
    configParams: Record<string, unknown>;
  }
): Promise<typeof OptimizedPrompt> {
  try {
    const prompt = generateOptimizedPromptSuggestionPrompt(
      originalPrompt,
      configParams
    );
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
