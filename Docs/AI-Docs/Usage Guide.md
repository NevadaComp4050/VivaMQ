
# Development and Usage Guide ai-processor Microservice
## Development Guide
### 1. Environment and Dependencies
Setup instructions are provided below, here is an overview.
- **Node.js**: Ensure you have Node.js installed on your machine.
- **RabbitMQ**: RabbitMQ should be installed and running locally on `amqp://localhost:5672`.
- **Docker** need to install Docker `https://www.docker.com/get-started/`
- **Environment Variables**: Set up an environment variable `OPENAI_API_KEY` with your OpenAI API key.
- **Dependencies**: amqplib openai uuid readline zod fs pdf-parse

### 2. Files Overview
- **openAIAPI.ts**: this module communicates with OpenAI's API using `zod` (structured queries). It takes in three parameters a `prompt` `submission` and `UUDI` payload. It prompts OpenAI and returns the a `JSON` response in a structured query format and UUID back.
- **aiInterface.ts** this module acts as a bridge between the docker messaging service and the `openAIAPI` module. It wraps and unwraps messages from the RabbitMQ messaging system and offloads the processing to the necessary module.
- **beSkel.ts** a mock up for debugging the BE messaging calls to RabbitMQ. For testing purposes only.
- **extractPDF.ts** designed to handle PDF processing tasks, specifically for extracting text from PDF documents.  



### 3. Setting Up the Environment
1. **Install Required Node.js Modules**:
   Needs to be done in the folder with the modules (i.e. `./ai-processor/tsSrc`)
   `npm install amqplib openai uuid readline fs pdf-parse`
   `npm i --save-dev @types/pdf-parse` (this is a frequent error)
   `npm install @types/amqplib --save-dev`
   `npm install --save-dev @types/node`

2. **Setup RabbitMQ using Docker**:
   Get RabbitMQ along with the management plugin `docker pull rabbitmq:management` (only need to run once per machine)
   Run docker container with RabbitMQ `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management` (each time you restart machine/Docker)

3. **Set OpenAI API Key**:
   Make OpenAI API key part of your environment variables (depends on your OS) `export OPENAI_API_KEY='your-openai-api-key'`


### 4. Example Workflow
1. open two CLIs
   1. run ts-node aiInterface.ts on on CLI
   2. run ts-node beSkel.ts (or the BE service) on the other CLI
2. The input for beSkel.ts is fixed but you can change to any string the `const s = ...` and the `const u = ... `
### 5. Backend integration
1. A working implementation can be seen in the beSkel.ts file. 
2. You will need to initiate the connection using.
   ```javascript 
       try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
    
        const sendQueue = "BEtoAI";
        const receiveQueue = "AItoBE";
    
        await channel.assertQueue(receiveQueue, { durable: false });
        await channel.assertQueue(sendQueue, { durable: false });

         //here you will set 's' to be a submission string input and a unique identifier 'u'

        const sendMsg = Buffer.from(JSON.stringify([s,u]));        
        channel.sendToQueue(sendQueue, sendMsg);
        channel.consume(receiveQueue, async (msg: amqp.ConsumeMessage | null) => {
            if (msg) {
                console.log(` [x] Received '${msg.content.toString()}'`);
                channel.ack(msg);

            }
        });
       }
   ```
3. The response will be in json format. Here is an example output (formatted for readability)
   ```javascript
   ["{\"categories\":[
   
   {\"category_name\":\"Concepts and Definitions\",        
   \"questions\":
   [{\"question_text\":\"What are the primary components of atomic nuclei studied in nuclear physics?\"},
   {\"question_text\":\"Explain the concept of nuclear binding energy and its relation to stability.\"}]},
   
   {\"category_name\":\"Forces and Interactions\",
   \"questions\":
   [{\"question_text\":\"What is the role of the strong nuclear force in atomic nuclei?\"},
   {\"question_text\":\"How does Einstein’s equation E=mc^2 relate to nuclear physics?\"}]},
   
   {\"category_name\":\"Applications\",
   \"questions\":[{\"question_text\":\"List and describe three practical applications of nuclear physics in different fields.\"}]}
   ]
   }",
   "12345"]
   ```
   
4. Once you have done your integration of the above code you can run using `## 4.Example workflow`

### 5. Error Handling

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
- **Extending Functionality**: Modify the scripts to expand AI capabilities, improve PDF handling, or adjust messaging logic as needed.
- **Debugging and Testing**: Enable debug modes and write tests to ensure each component functions correctly.


