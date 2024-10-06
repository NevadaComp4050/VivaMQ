import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateRubricPrompt } from "../utilities/promptGenerators";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const Rubric = z.object({
  criteria: z.array(
    z.object({
      name: z.string(),
      descriptors: z.record(z.enum(["F", "P", "C", "D", "HD"]), z.string()),
    })
  ),
});

async function createRubric(
  openAIClient: OpenAI,
  {
    assessmentTask,
    criteria,
    keywords,
    learningObjectives,
    existingGuide,
  }: {
    assessmentTask: string;
    criteria: string[];
    keywords: string[];
    learningObjectives: string[];
    existingGuide: string;
  }
): Promise<typeof Rubric> {
  try {
    const prompt = generateRubricPrompt(
      assessmentTask,
      criteria,
      keywords,
      learningObjectives,
      existingGuide
    );
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(Rubric, "Rubric"),
    });

    const rubric = response.choices[0].message.content;
    if (rubric) {
      return JSON.parse(rubric);
    } else {
      throw new Error("Failed to create rubric");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { createRubric };
