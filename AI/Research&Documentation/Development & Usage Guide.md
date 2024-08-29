
# Development and Usage Guide ai-processor Microservice
## Development Guide
### 1. Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine.
- **RabbitMQ**: RabbitMQ should be installed and running locally on `amqp://localhost:5672`.
- **Environment Variables**: Set up an environment variable `OPENAI_API_KEY` with your OpenAI API key.
- **Dependencies**: Install the following npm packages `npm install amqplib openai uuid readline fs pdf-parse`.
- **.gitIgnore**: Please add .gitignore to project folder with 
~~~ 
   .vscode/ 
   node_modules/
   npm-debug.log
   .env
   .env.local 
~~~

### 2. Files Overview
- **singlePromptNoPDF.js**: Listens for prompts on the `request_queue`, sends them to the OpenAI API, and returns the response to the `response_queue`.
- **serviceSimulator.js**: Used for Testing! This module sends prompts through RabbitMQ
- **singlePDFStaticPrompt.js**: Inputs PDF and prompt, Extracts PDF text translates into String format, sends it to the OpenAI API for processing and returns Viva questions.

### 3. Setting Up the Environment
1. **Install Required Node.js Modules**:
   Needs to be done in the folder with the modules (i.e. singlePromptNoPDF.js, serviceSimulator.js, singlePDFStaticPrompt.js)
   `npm install amqplib openai uuid readline fs pdf-parse`
2. **Setup RabbitMQ using Docker**:
   Get RabbitMQ along with the management plugin `docker pull rabbitmq:management` (only need to run once per machine)
   Run docker container with RabbitMQ `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management` (each time you restart machine/Docker)

3. **Set OpenAI API Key**:
   Make OpenAI API key part of your environment variables (depends on your OS) `export OPENAI_API_KEY='your-openai-api-key'`


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
