// main.js
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import os from "os";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

// Define the structure for a question
const Question = z.object({
  question_text: z.string(),
});

// Define the structure for a category, which includes a name and an array of questions
const Category = z.object({
  category_name: z.string(),
  questions: z.array(Question),
});

// Define the top-level structure, which includes an array of categories
const QuestionResponse = z.object({
  categories: z.array(Category),
});

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate questions based on document content
export async function generateQuestions(
  documentContent: string
): Promise<void> {
  let tempFilePath: string | null = null;

  try {
    // Create a temporary file with the document content
    tempFilePath = path.join(os.tmpdir(), `document-${Date.now()}.txt`);
    fs.writeFileSync(tempFilePath, documentContent);

    // Read the content of the document
    const documentText = fs.readFileSync(tempFilePath, "utf-8");

    // Call the chat completion API with the defined schema
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert computer science expert who generates specific viva questions for documents provided to you.",
        },
        {
          role: "user",
          content: `Read the following document content and generate viva questions specific to its content.\n\n${documentText}`,
        },
      ],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    // Retrieve and print the structured response
    const response = completion.choices[0].message;

    if (response.parsed) {
      console.log(JSON.stringify(response.parsed, null, 2));
    } else if (response.refusal) {
      console.log("Model refused to respond:", response.refusal);
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  } finally {
    // Clean up the temporary file
    if (tempFilePath) {
      fs.unlinkSync(tempFilePath);
    }
  }
}

// Example usage
const documentContent = `
  This is an example document. 
  It should contain text relevant for generating viva questions.
  Let's see how the model performs.
`;

generateQuestions(documentContent).catch(console.error);