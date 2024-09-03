

**deprecated reources**

./ai-processor/deprecatedResources/
- **aiRMQinterface.ts**: This module uses mediates messages between RabbitMQ (using `amqplib`) and `openAIApi.ts`, it will hold or call the required JSON formats for structured queries
- **beRMQinterface.ts**: This is a testing interface, a placeholder for BE requests.
- **singlePromptNoPDF.js**: Listens for prompts on the `receiveQueue`, sends them to the OpenAI API, and returns the response to the `sendQueue`.
- **serviceSimulator.js**: Used for Testing! This module sends prompts through RabbitMQ
- **singlePDFStaticPrompt.js**: Inputs PDF and prompt, Extracts PDF text translates into String format, sends it to the OpenAI API for processing and returns Viva questions.

 (i.e. singlePromptNoPDF.js, serviceSimulator.js, singlePDFStaticPrompt.js)
### 1. Single Prompt without PDF 
1. **Run `singlePromptNoPDF.js`**: You do not have to do anything here (black box)
2. **Run `serviceSimulator.js`**: Enter your prompt into the terminal. BE CLI will display response
3. **Run `serviceSimulator.js`**: to send another prompt you will need to run again
4. **Stop `singlePromptNoPDF.js` on CLI**: this will keep running if not shutdown


### 2. Processing a single PDF (static prompt)
1. **Place PDF in src folder**: (i.e. example.pdf)
2. **Open singlePDFStaticPrompt.js** 
3. **Modify File Path**: On line 40 update `example.pdf` to uploaded pdf name
4. **Run `singlePDFStaticPrompt.js`**
5. **Output**: Response will be printed in the terminal
