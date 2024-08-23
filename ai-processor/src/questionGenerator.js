"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuestions = generateQuestions;
// main.js
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const zod_1 = require("zod");
const zod_2 = require("openai/helpers/zod");
// Define the structure for a question
const Question = zod_1.z.object({
    question_text: zod_1.z.string(),
});
// Define the structure for a category, which includes a name and an array of questions
const Category = zod_1.z.object({
    category_name: zod_1.z.string(),
    questions: zod_1.z.array(Question),
});
// Define the top-level structure, which includes an array of categories
const QuestionResponse = zod_1.z.object({
    categories: zod_1.z.array(Category),
});
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Function to generate questions based on document content
function generateQuestions(documentContent) {
    return __awaiter(this, void 0, void 0, function* () {
        let tempFilePath = null;
        try {
            // Create a temporary file with the document content
            tempFilePath = path_1.default.join(os_1.default.tmpdir(), `document-${Date.now()}.txt`);
            fs_1.default.writeFileSync(tempFilePath, documentContent);
            // Read the content of the document
            const documentText = fs_1.default.readFileSync(tempFilePath, "utf-8");
            // Call the chat completion API with the defined schema
            const completion = yield client.beta.chat.completions.parse({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert computer science expert who generates specific viva questions for documents provided to you.",
                    },
                    {
                        role: "user",
                        content: `Read the following document content and generate viva questions specific to its content.\n\n${documentText}`,
                    },
                ],
                response_format: (0, zod_2.zodResponseFormat)(QuestionResponse, "QuestionResponse"),
            });
            // Retrieve and print the structured response
            const response = completion.choices[0].message;
            if (response.parsed) {
                console.log(JSON.stringify(response.parsed, null, 2));
            }
            else if (response.refusal) {
                console.log("Model refused to respond:", response.refusal);
            }
        }
        catch (error) {
            console.error("Error generating questions:", error);
            throw error;
        }
        finally {
            // Clean up the temporary file
            if (tempFilePath) {
                fs_1.default.unlinkSync(tempFilePath);
            }
        }
    });
}
// Example usage
const documentContent = `
  This is an example document. 
  It should contain text relevant for generating viva questions.
  Let's see how the model performs.
`;
generateQuestions(documentContent).catch(console.error);
