
# Developer Documentation for AI module
## 1. Project Overview
- **Introduction**: 
The project integrates RabbitMQ for message processing and OpenAI for generating responses based on input data. It sets up a server to handle communication between queues and the API, processing messages in real-time.
- **Technology Stack**: Node.js, Docker, OpenAI 
- **Key Modules**: 
  - Express Web Server: The server.ts file sets up a basic Express.js web server that listens on a specified port. The server starts the message processing system when launched.
  - RabbitMQ for Message Queuing: An asynchronous message broker, between the ai-microservice and be-microservice
  - OpenAI Integration: Connection to OpenAI’s API, prompts and submissions then parsing the responses back through RabbitMQ
  - Index: This is the entry point for the server
- **Dependencies**: `amqplib dotenv openai uuid readline fs pdf-parse zod`
- **Current OpenAI Model**: `gpt-4o-2024-08-06`

## 2. Getting Started
### Installation Instructions
### Project Setup
- [VivaMQ Repository](https://github.com/NevadaComp4050/VivaMQ)
- Inside ai-processor folder
  - create `.env` file with
    ``` js
        OPENAI_API_KEY= "PUT YOUR API KEY HERE"
        RABBITMQ_URL=amqp://user:password@rabbitmq:5672
    ```
  - Get RabbitMQ Docker container `docker pull rabbitmq:management`
  - Build Docker container `docker-compose build`
- How to run initialization scripts (like database migrations or seed data).
### Running the Application
- Inside ai-processor folder, CLI:
  - `docker-compose -d`

## 3. Testing
### Test Framework
JEST: all tests located in `/ai-processor/__test__`
  - Functional testing: each API endpoint works as expected, receiving the correct input and returning the expected output
  - Performance testing: Latency, throughput, scalability
  - Integration testing: seemless dataflow between components of system
  - Error Handling testing: 
  - Prompt and Response testing: Separate files included ./Docs/AI-Docs/testing(Rx).md
 
### Running Tests
Instructions on how to run tests

### Test Coverage
Discuss what is being tested

### Writing New Tests
Instructions on how to write tests

## 4. Deployment Instructions
### Production Deployment
Explain how to deploy the application to a production environment.
### Hosting Environment
List instructions for deploying to cloud platforms (e.g., AWS, Azure, Google Cloud, Heroku).
### Docker
Provide Docker setup, build, and run instructions.
### CI/CD Pipeline
Describe how the module fits into the CI/CD pipeline, if applicable.

## 5. Troubleshooting
### Common Issues
List common problems and how to resolve them.
### Error Handling
Explain how errors are logged and handled in the system.
### Debugging Tips
Provide tips on debugging common issues, including tool usage


## Structured Outputs
1. The response will be in json format. Here is an example output (formatted for readability)
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
   
   ## Batch Processing
   OpenAIEndpoint = "/v1/chat/completions";
   
   ### Query using .jsonl File

   ``` js
   {"custom_id": "example.pdf", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-4o-2024-08-06", "messages": [{"role": "user", "content": "Return five questions to assess understanding of the following text:\n\nThis is the content of example.pdf."}],"max_tokens": 1000}}
   ```

**Main Execution**
``` javascript
(async () => {
  const inputFilePath = path.join('./input.jsonl');  // .jsonl file path
  const endpoint: OpenAIEndpoint = '/v1/chat/completions'; 
  const completionWindow: CompletionWindow = '24h';

  const resultFileName = await processBatch(inputFilePath, endpoint, completionWindow);

  // Print the results
  if (resultFileName) {
    console.log(`Batch processing completed. Results saved in ${resultFileName}`);
  }
 })();

```

1. API Documentation 
- **RabbitMQ Endpoint**:
- **OpenAI Endpoint**: 


## 6. References
Provide links to the documentation for any key external libraries or tools used in the project.

