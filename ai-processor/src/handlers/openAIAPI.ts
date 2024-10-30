import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { generateSingleQuestionVivaPrompt } from "../utilities/promptGenerators";
import { OpenAI } from "openai";

const Question = z.object({
  question_text: z.string(),
  question_category: z.string(),
});

const QuestionResponse = z.object({
  questions: z.array(Question),
});

export async function promptSubUUID(
  openAIClient: OpenAI,
  {
    submission,
    uuid,
    customPrompt = null,
  }: {
    submission: string;
    uuid: string;
    customPrompt?: string | null;
  }
): Promise<[string, string]> {
  try {
    console.log("Prompting for submission:", submission);
    const prompt = generateSingleQuestionVivaPrompt(submission, customPrompt);
    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    const responseText = response.choices[0].message.content;
    return responseText != null ? [responseText, uuid] : ["response error", uuid];
  } catch (error) {
    console.error("Error in promptSubUUID:", error);
    throw error;
  }
}