import fs from 'fs';
import { OpenAI } from 'openai';
import path from 'path';
import pdfParse from 'pdf-parse';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract text from a PDF
async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}

// Function to prepare a new input.jsonl file with the extracted text 
async function prepareJsonlFile(pdfPaths: string[], inputJsonlFile: string, customPrompt: string | null) {
  const fileStream = fs.createWriteStream(inputJsonlFile);

  for (const pdfPath of pdfPaths) {
    const pdfName = path.basename(pdfPath);  // Get the file name (e.g., "example.pdf")
    const text = await extractTextFromPDF(pdfPath);  // Extract text from the PDF

    const generatePrompt = `
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
    
    Document text:\n\n${text}
    `;

    // Format the extracted text into a valid format accpected by the AI
    const jsonlEntry = {
      custom_id: pdfName,
      method: "POST",
      url: "/v1/chat/completions",
      body: {
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "user",
            content: generatePrompt
          }
        ],
        max_tokens: 1000  // Adjust as needed
      }
    };

    // Write each entry as a JSON object per line
    fileStream.write(JSON.stringify(jsonlEntry) + '\n');
  }

  fileStream.end();
  console.log(`input.jsonl created with text from PDFs: ${inputJsonlFile}`);
}

type OpenAIEndpoint = "/v1/chat/completions";
type CompletionWindow = "24h" ;

// Function to process the batch job
async function processBatch(inputFilePath: string, endpoint: OpenAIEndpoint, completionWindow: CompletionWindow):  Promise<any> {
  try {
    // Upload the input.jsonl file
    const fileStream = fs.createReadStream(inputFilePath);
    const uploadedFile = await client.files.create({
      purpose: 'batch',
      file: fileStream,
    });

    console.log(`Uploaded input file: ${uploadedFile.id}`);

    // Create the batch job
    let batchJob = await client.batches.create({
      input_file_id: uploadedFile.id,
      endpoint: endpoint,
      completion_window: completionWindow,
    });

    console.log(`Batch job created with ID: ${batchJob.id}`);

    // Monitor the batch job status
    let jobStatus = batchJob.status;
    while (jobStatus !== 'completed' && jobStatus !== 'failed' && jobStatus !== 'cancelled') {
      batchJob = await client.batches.retrieve(batchJob.id);
      jobStatus = batchJob.status;
      console.log(`Batch job status: ${jobStatus}`);
    }

    if (jobStatus === 'failed') {
      // Capture failure message
      console.error('Batch job failed with the following error:', batchJob.errors);
    }

    // Handle the results
    if (jobStatus === 'completed') {
      const resultFileId = batchJob.output_file_id;

      if (resultFileId) {
        // Retrieve file content using OpenAI's `files.content` method
        const fileResponse = await client.files.content(resultFileId);
        const fileContents = await fileResponse.text(); // Get the content as text

        const resultFileName = 'batch_job_results.jsonl';

        // Save results to a file
        fs.writeFileSync(resultFileName, fileContents);
        console.log(`Results saved to: ${resultFileName}`);
        return resultFileName;
      }
    } else {
      console.error(`Batch job failed with status: ${jobStatus}`);
    }
  } catch (error) {
    console.error('Error during batch processing:', error);
  }
}

const debug = false;  
if (debug) {
  (async () => {
    const pdfPaths = [
      path.join('./PDFs/example.pdf'),
      path.join('./PDFs/testpdf.pdf'),
      path.join('./PDFs/pdf_1.pdf'),
    ];
    const inputFilePath = path.join('./input.jsonl');

    try {
      const customPrompt = null;
      await prepareJsonlFile(pdfPaths, inputFilePath, customPrompt);

      const endpoint: OpenAIEndpoint = '/v1/chat/completions';
      const completionWindow: CompletionWindow = '24h';

      const resultFileName = await processBatch(inputFilePath, endpoint, completionWindow);

      if (resultFileName) {
        console.log(`Batch processing completed. Results saved in: ${resultFileName}`);
      }
    } catch (error) {
      console.error('Failed to process Batch Job', error);
    }
  })();
}