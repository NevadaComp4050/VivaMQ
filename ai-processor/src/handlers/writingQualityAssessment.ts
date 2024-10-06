import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { generateAssessmentQualityPrompt } from "../utilities/promptGenerators";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const QualityAssessment = z.object({
  structure: z.string(),
  grammar: z.string(),
  spelling: z.string(),
  vocabulary: z.string(),
  overall_quality: z.string(),
  recommendations: z.array(z.string()),
});

async function assessWritingQuality(
  openAIClient: OpenAI,
  {
    document,
    criteria
  }: {
    document: string;
    criteria: string;
  }
): Promise<typeof QualityAssessment> {
  try {
    const prompt = generateAssessmentQualityPrompt(document, criteria);
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(
        QualityAssessment,
        "QualityAssessment"
      ),
    });

    const assessment = response.choices[0].message.content;
    if (assessment) {
      return JSON.parse(assessment);
    } else {
      throw new Error("Failed to generate writing quality assessment");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { assessWritingQuality };
