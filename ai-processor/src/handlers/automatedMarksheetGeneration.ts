import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateAutomatedMarkingSheetPrompt } from "../utilities/promptGenerators";
import { LogError } from '../logger';

dotenv.config();

const Marksheet = z.object({
  scores: z.record(z.number()),
  feedback: z.record(z.string()),
  total_score: z.number(),
  overall_feedback: z.string(),
});

class MarksheetGenerator {

  @LogError()
async generateAutomatedMarksheet(
  openAIClient: OpenAI,
  {
    document,
    rubric,
    learningOutcomes,
  }: {
    document: string;
    rubric: string;
    learningOutcomes: string;
  }
): Promise<typeof Marksheet> {
  try {
    const prompt = generateAutomatedMarkingSheetPrompt(
      document,
      rubric,
      learningOutcomes
    );
    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(Marksheet, "Marksheet"),
    });

    const marksheet = response.choices[0].message.content;
    if (marksheet) {
      return JSON.parse(marksheet);
    } else {
      throw new Error("Failed to generate automated marksheet");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
}

export { MarksheetGenerator };
