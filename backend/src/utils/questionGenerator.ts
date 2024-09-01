import axios from 'axios';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const UPLOADTHING_API_BASE_URL = 'https://uploadthing.com/api'; // Replace with actual Uploadthing API base URL
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Ensure this environment variable is set

async function fetchFileText(fileId: string): Promise<string> {
  try {
    const response = await axios.get(
      `${UPLOADTHING_API_BASE_URL}/files/${fileId}`,
      {
        responseType: 'arraybuffer',
      }
    );
    const pdfText = Buffer.from(response.data, 'binary').toString('utf-8');
    // Implementing a PDF Text Extraction logic here
    // For example, using `pdf-parse` for PDF text extraction
    // const pdfData = await pdfParse(pdfBuffer);
    // return pdfData.text;
    return pdfText; // Replace this with actual extracted text
  } catch (error) {
    throw new Error(`Failed to fetch file text: ${error.message}`);
  }
}

async function generateQuestionsFromText(
  text: string,
  prompt: string
): Promise<{
  categories: {
    category_name: string;
    questions: { question_text: string }[];
  }[];
}> {
  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an AI that generates categorized questions from a given text.',
        },
        {
          role: 'user',
          content: `${prompt}\n\n${text}`,
        },
      ],
      temperature: 1,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'categories_response',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              categories: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category_name: {
                      type: 'string',
                    },
                    questions: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          question_text: {
                            type: 'string',
                          },
                        },
                        required: ['question_text'],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ['category_name', 'questions'],
                  additionalProperties: false,
                },
              },
            },
            required: ['categories'],
            additionalProperties: false,
          },
        },
      },
    });

    const generatedText = gptResponse.choices[0].message.content;

    // Parse the generated text into a JSON object.
    const categories = JSON.parse(generatedText ?? '');

    return categories;
  } catch (error) {
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

export async function generateQuestionsForFiles(fileIds: string[]): Promise<
  {
    fileId: string;
    categories: {
      category_name: string;
      questions: { question_text: string }[];
    }[];
  }[]
> {
  const results: {
    fileId: string;
    categories: {
      category_name: string;
      questions: { question_text: string }[];
    }[];
  }[] = [];

  for (const fileId of fileIds) {
    const fileText = await fetchFileText(fileId);
    const prompt =
      'Based on the following text, generate multiple choice questions, categorized appropriately:';
    const categories = await generateQuestionsFromText(fileText, prompt);

    results.push({
      fileId,
      categories,
    });
  }

  return results;
}

export async function regenerateQuestionsForFile(fileId: string): Promise<{
  categories: {
    category_name: string;
    questions: { question_text: string }[];
  }[];
}> {
  const fileText = await fetchFileText(fileId);
  const prompt =
    'Generate a new set of multiple choice questions based on the following text, categorized appropriately:';
  return await generateQuestionsFromText(fileText, prompt);
}

export async function regenerateSingleQuestionForFile(
  fileId: string
): Promise<string> {
  const fileText = await fetchFileText(fileId);
  const prompt =
    'Generate a single multiple choice question based on the following text:';
  const categories = await generateQuestionsFromText(fileText, prompt);
  return categories[0]?.questions[0]?.question_text || '';
}

export default {
  generateQuestionsForFiles,
  regenerateQuestionsForFile,
  regenerateSingleQuestionForFile,
};
