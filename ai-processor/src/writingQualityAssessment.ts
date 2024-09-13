import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";

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

const generatePrompt = (document: string, criteria: string) => `
Assess the quality of the following document based on these criteria: ${criteria}

Document:
${document}

Provide a detailed assessment of the document's quality, including structure, grammar, spelling, and vocabulary usage. Also, provide recommendations for improvement.
`;

async function assessWritingQuality(
  document: string,
  criteria: string
): Promise<typeof QualityAssessment> {
  try {
    const prompt = generatePrompt(document, criteria);
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
