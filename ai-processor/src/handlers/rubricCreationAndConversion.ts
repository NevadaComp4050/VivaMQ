import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateRubricPrompt } from "../utilities/promptGenerators";

dotenv.config();

const Descriptor = z.object({
  F: z.string(),
  P: z.string(),
  C: z.string(),
  D: z.string(),
  HD: z.string(),
});

const Criterion = z.object({
  name: z.string(),
  descriptors: Descriptor,
  marks: z.number(),
});

const Rubric = z.object({
  title: z.string(),
  criteria: z.array(Criterion),
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
): Promise<z.infer<typeof Rubric>> {
  try {
    const prompt = generateRubricPrompt(
      assessmentTask,
      criteria,
      keywords,
      learningObjectives,
      existingGuide
    );
    const response = await openAIClient.chat.completions.create({
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

export { createRubric, Rubric };
