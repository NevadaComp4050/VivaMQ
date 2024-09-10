import { z } from "zod";
import { OpenAI } from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// question structure
const Question = z.object({
  question_text: z.string(),
  question_category: z.string(),
});

// zod API response: array of categories
const QuestionResponse = z.object({
  questions: z.array(Question),
});

// env API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-1234",
});

const generatePrompt = (document: string, customPrompt: string | null) => `
You are an experienced professor tasked with generating viva questions based on a student's document. Your goal is to assess the student's understanding of the material, their ability to discuss the concepts, and their capacity to expand on the ideas presented. Your task is to generate five viva questions that will effectively evaluate the student's knowledge and critical thinking skills. These questions should:

1. Test the student's familiarity with the written text
2. Assess their ability to discuss the concepts in depth
3. Challenge them to expand on the ideas presented 

When formulating your questions, consider the following criteria:
- Relevance: Ensure questions directly relate to key concepts in the document
- Coverage: Address all significant topics discussed
- Depth: Require thorough understanding rather than surface-level knowledge
- Clarity: Prompt clear and concise articulation of ideas
- Open-ended nature: Encourage detailed explanations
- Analytical thinking: Require analysis, comparison, or critique of concepts
- Creativity: Push students to apply concepts to new scenarios or generate new ideas

Examples of good questions:
1. "How does [concept from the document] relate to [another concept]? Can you provide an example of their interaction in a real-world scenario?"
2. "What are the potential limitations or criticisms of [theory/method discussed in the document]? How would you address these concerns?"
3. "If you were to extend the research presented in this document, what additional areas or aspects would you explore, and why?" 

${customPrompt ? `Additional instructions: ${customPrompt}\n\n` : ""}

As you generate the questions, increase their technicality and complexity. The first question should be relatively straightforward, while the final question should challenge the student to think critically and creatively about the material. Generate exactly five questions based on the document provided, adhering to the criteria and format specified above.

Document:
${document}
`;

// function to prompt OpenAI and parse the response using Zod
async function promptSubUUID({
  prompt,
  submission,
  uuid,
  customPrompt = null, // New optional parameter
}: {
  prompt: string;
  submission: string;
  uuid: string;
  customPrompt?: string | null;
}): Promise<[string, string]> {
  try {
    const generatedPrompt = generatePrompt(submission, customPrompt);
    console.log("[x] Sending to OpenAI: \n", generatedPrompt);

    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06", // Use the appropriate model
      messages: [{ role: "user", content: generatedPrompt }],
      response_format: zodResponseFormat(QuestionResponse, "QuestionResponse"),
    });

    const responseText = response.choices[0].message.content;
    if (responseText != null) return [responseText, uuid];
    else return ["response error", uuid];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export { promptSubUUID };

// ------------------- debugging --------------------//

const debug = true;
if (debug) {
  (async () => {
    try {
      const response = await promptSubUUID({
        prompt: "",
        submission: `
        Text of the document goes here.
        `,
        uuid: "1234",
        customPrompt: "",
      });

      if (response) console.log("The response is: ", response);
    } catch (error) {
      console.error("failed to get response", error);
    }
  })();
}
