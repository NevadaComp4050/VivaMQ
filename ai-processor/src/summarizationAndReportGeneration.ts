import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const SummaryAndReport = z.object({
  summary: z.string(),
  detailed_report: z.string(),
});

const generatePrompt = (document: string) => `
Summarize the following document and generate a detailed report:

Document:
${document}

Provide a concise summary followed by a detailed report on the submission.
`;

async function generateSummaryAndReport(
  document: string
): Promise<typeof SummaryAndReport> {
  try {
    const prompt = generatePrompt(document);
    const response = await client.chat.completions.create({
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

export { generateSummaryAndReport };
