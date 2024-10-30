import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateDocumentSummaryPrompt } from "../utilities/promptGenerators";
import { LogError } from '../logger';

dotenv.config();


const SummaryAndReport = z.object({
  summary: z.string(),
  detailed_report: z.string(),
});

class generateSummaryAndReport {

  @LogError()
async  generateSummaryAndReport(
  openAIClient: OpenAI,
  {
    document
  }: {
    document: string;
  }
): Promise<typeof SummaryAndReport> {
  try {
    const prompt = generateDocumentSummaryPrompt(document);
    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(SummaryAndReport, "SummaryAndReport"),
    });

    const result = response.choices[0].message.content;
    if (result) {
      return JSON.parse(result);
    } else {
      throw new Error("Failed to generate summary and report");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
}

export { generateSummaryAndReport };
