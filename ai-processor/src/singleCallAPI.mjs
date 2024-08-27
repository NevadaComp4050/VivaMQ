import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();  

console.log("API Key:", process.env.OPENAI_API_KEY); // need your own API and env file setup

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
    try {

        const file = await client.files.create({
            file: fs.createReadStream("testpdf.pdf"),
            purpose: "assistants",
        });

        console.log('File uploaded successfully:', file);

       
        const vectorStore = await client.beta.vectorStores.create({
            name: "Assessment1",
            file_ids: [file.id],
        });

        console.log('Vector store created successfully:', vectorStore);

       
        const assistant = await client.beta.assistants.create({
            name: "Academic Viva Creator",
            instructions: "You are an expert computer science expert who has been asked to assist with generating specific viva questions for assessments uploaded.",
            model: "gpt-4o",
                tools: [{ type: "file_search" }],
        });

        console.log('Assistant created successfully:', assistant);

        await client.beta.assistants.update(assistant.id, {
            tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
          });

          console.log('Assistant updated');

      
        const thread = await client.beta.threads.create();

        let run = await client.beta.threads.runs.createAndPoll(
            thread.id,
            { 
              assistant_id: assistant.id,
              instructions: "Read the PDF and generate viva questions specific to the PDF",
            }
        );

        if (run.status === 'completed') {
            const messages = await client.beta.threads.messages.list(
                run.thread_id
            );
            for (const message of messages.data.reverse()) {
                console.log(`${message.role} > ${message.content[0].text.value}`);
            }
        } else {
            console.log(run.status);
        }

    } catch (error) {
        console.error('Error during setup:', error);
    }
}


main();
