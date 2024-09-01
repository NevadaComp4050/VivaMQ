
# Development and Usage Guide ai-processor Microservice
## Development Guide
### 1. Prerequisites
Setup instructions are provided below, here is an overview.
- **Node.js**: Ensure you have Node.js installed on your machine.
- **RabbitMQ**: RabbitMQ should be installed and running locally on `amqp://localhost:5672`.
- **Docker** need to install Docker `https://www.docker.com/get-started/`
- **Environment Variables**: Set up an environment variable `OPENAI_API_KEY` with your OpenAI API key.
- **Dependencies**: amqplib openai uuid readline zod

### 2. Files Overview
./ai-processor/tsSrc/
- **aiRMQinterface.ts**: This module uses mediates messages between RabbitMQ (using `amqplib`) and `openAIApi.ts`, it will hold or call the required JSON formats for structured queries
- **beRMQinterface.ts**: This is a testing interface, a placeholder for BE requests.
- **openAIAPI.ts**: this module communicates with OpenAI's API using `zod` (structured queries). It takes in two parameters a `JSON` payload and a UUID. It prompts OpenAI and returns the response and UUID back.
- 
- **jsonFormats.ts**: this module contains sample JSON payloads. It will eventually store all the payloads required by the microservice.
  

  *(depracated)* you will need `npm install fs pdf-parse`
  ./ai-processor/src/
- **singlePromptNoPDF.js**: Listens for prompts on the `receiveQueue`, sends them to the OpenAI API, and returns the response to the `sendQueue`.
- **serviceSimulator.js**: Used for Testing! This module sends prompts through RabbitMQ
- **singlePDFStaticPrompt.js**: Inputs PDF and prompt, Extracts PDF text translates into String format, sends it to the OpenAI API for processing and returns Viva questions.

### 3. Setting Up the Environment
1. **Install Required Node.js Modules**:
   Needs to be done in the folder with the modules (i.e. `./ai-processor/tsSrc`)
   `npm install amqplib openai uuid readline`
2. **Setup RabbitMQ using Docker**:
   Get RabbitMQ along with the management plugin `docker pull rabbitmq:management` (only need to run once per machine)
   Run docker container with RabbitMQ `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management` (each time you restart machine/Docker)

3. **Set OpenAI API Key**:
   Make OpenAI API key part of your environment variables (depends on your OS) `export OPENAI_API_KEY='your-openai-api-key'`

   #### Defining Data Structures

All messages are to be parsed into the `jsonFormats.ts` file to ensure the correct structure is being sent to OpenAI. Below are the pre-defined `zod`  data structures:
- **Question**: Represents a single question with a `question_text` field.
- **Category**: Represents a category containing a name and an array of questions.
- **QuestionResponse**: Represents the response structure containing an array of categories.


## Usage Guide
All these steps needs to be done using CLI in folder with the modules (i.e. singlePromptNoPDF.js, serviceSimulator.js, singlePDFStaticPrompt.js)
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

### 3. Example Workflow
### 4. Error Handling

- **Connection Errors**: Ensure RabbitMQ is running and accessible.
- **API Key Errors**: Verify that the `OPENAI_API_KEY` environment variable is correctly set.
- **Unhandled Errors**: Check logs for detailed error messages. The scripts log errors to the console.


## upcoming features
1. **Update Data Structures**: add new Zod schemas to handle additional data structures.
2. **Enhance API Requests**: different types of requests to the OpenAI API.
3.  **Error Handling**
- rubric generator
- assessment quality checker
- using another AI technology