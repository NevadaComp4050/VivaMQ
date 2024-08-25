## AI Module - API Interfaces and Integration Document

### 1. Overview
#### 1.1 Introduction
Provide a brief introduction to the API, its purpose, and what functionality it provides. 

This document provides a guide to the OpenAI API for the VivaMQ AI Component. The API facilitates the integration of AI with generating Viva questions based on student submissions. It provides developers with the tools to access AI features, enabling seamless interaction between the Backend and the AI model.

#### 1.2 Audience
Describe the intended audience for this document (e.g., developers, integration engineers).

This document is intended for developers, integration engineers and software architects who are responsible for integrating the AI module with the VivaMQ system. It assumes familiarity with programming languages such as Python and JavaScipt.

---

### 2. API Access

#### 2.1 Authentication and Authorization
Explain the methods of authentication and authorization supported by the API.
- **API Key**: Explain how to obtain and use an API key.
- **OAuth 2.0**: Describe the OAuth 2.0 flow supported (e.g., Client Credentials, Authorization Code).

To access the API, an API key is required. An API key can be obtained by registering on the VivaMQ system. The system administrator would then authorize the API key with the 'Authorization' header for each request as follows:

Authorization: Bearer YOUR_API_KEY

The API supports the OAuth 2.0 authorization framework. The flow involves the following steps:

1) The user is directed to the VivaMQ authorization server's login page. The user will then be prompted by the service to authorize or deny the application access to their account.

2) Once the authorization had been granted, the server redirects the user back to the application with an authorization code. 

3) The application requests for an access token by passing the authorization code. The request would be a POST request also conatining the client credentials such as client ID and client secret.

4) If the authorization code is valid, the server will respond with an access token.

5) The applcation can now use the token to access the user’s account. The access token will be included in the 'Authorization' header when making API requests (Authorization: Bearer ACCESS_TOKEN). 


#### 2.2 Endpoints

List and describe the primary API endpoints, including base URLs for different environments (e.g., production, staging).
- **Base URL**: `https://api.example.com/`

Key Endpoint:
- Viva Question Generation:
  - /questions
  - Description: Generates Viva questions based on a student's submission.
- Users:
  - /users
  - Description: Create, update, delete or retrieve user information.
- Submissions:
  - /submissions
  - Description: Manage items such as assignments and project submitted by students.



#### 2.3 Rate Limiting
Describe any rate limiting applied to the API, including limits and how to handle them.

The API rate limits are as follows:
- 500 RPM: Maximum of 500 requests per minue.
- 30,000 TPD: Daily limit of 30,000 tokens.

If the API rate limit is hit, the API will return a '429 Too Many Requests' error. 
Developers are advised to implement retry logic with exponential backoff. Retrying with exponential backoff means to perform a short sleep when a rate limit error is encountered, then retrying the unsuccessful request. The process is repeated with an extended sleep duration if the request is still denied. This keeps going until either the request is fullfilled or the allotted amount of tries is reached. 

---
### 3. How to Use the API

#### 3.1 Making Requests
Explain how to make a request to the API, including required headers (e.g., Content-Type, Authorization).

To make use of the API, setup an envrionment and authenticate the API. The follwoing example illustrates generating Viva questions using the OpenAI API. 

**Import necessary modules and load the environment variable from a '.env' file:**
```javascript
import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();  

console.log("API Key:", process.env.OPENAI_API_KEY); // need your own API and env file setup
```
- `dotenv.config();` : Loads the enviroment varaibles defined in the `.env` file into `process.env`
- `console.log("API Key:", process.env.OPENAI_API_KEY);` : Prints the API key to the console. Replace `OPENAI_API_KEY` with the client's own API key and ensure that the key is correctly set up in the envrionment file.

**Initialize the OpenAI client using the API Key:**
```javascript
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
```
- Replace `OPENAI_API_KEY` with your own API key
- This creates an instance of the OpenAI client using the API key. 

**Upload a file to the AI:**
```javascript
const file = await client.files.create({
    file: fs.createReadStream("testpdf.pdf"),
    purpose: "assistants",
});

console.log('File uploaded successfully:', file);
```
- `client.files.create`: Creates or uploads a file to the API.
- `file: fs.createReadStream("testpdf.pdf")`: Creates a readable stream from the file `testpdf.pdf` and sets it to `file`. The file is then sent to the API.
- `purpose: "assistants"` : Indicates that the file is to be used by the AI assistant.
- `console.log('File uploaded successfully:', file)`: prints a success message together with the file information onto the console.


```javascript
const vectorStore = await client.beta.vectorStores.create({
    name: "Assessment1",
    file_ids: [file.id],
});

console.log('Vector store created successfully:', vectorStore);
```
- Creates a vector store called `Assessment1` using the uploaded file ID. This allows the AI to search through and retrive data from the document.

**Creating an AI assistant:**
```javascript
const assistant = await client.beta.assistants.create({
    name: "Academic Viva Creator",
    instructions: "You are an expert computer science expert who has been asked to assist with generating specific viva questions for assessments uploaded.",
    model: "gpt-4o",
    tools: [{ type: "file_search" }],
});

console.log('Assistant created successfully:', assistant);
```
- `client.beta.assistants.create` : Creates an AI assistant using the client's API key.
- `name` : Sets the name of the assistant to 'Academic Viva Creator'.
- `instructions` : Defines the role and purpose of the assistant.
- `model: "gpt-4o"` : Specifies the AI model being used.
- `tools: [{ type: "file_search" }]` : Indicates that the AI assistant is equipped with the `file_search` tool to search through the file. 

**The AI assistant is updated with the vectore store:**
```javascript
await client.beta.assistants.update(assistant.id, {
    tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
});
    
console.log('Assistant updated');
```
- `client.beta.assistants.update`: Updates the existing AI assistant.
- It takes two arguments `assistant.id` and the object (tool_resources, file_search, vector_store_ids) containing the update information.
- `assistant.id`: Unique ID of the created assistant.
- `tool_resources`: Indicates the resources for the assistant's tool.
- `file_search`: Indicates the file search tool that was created.
- `vector_store_ids`: An array containing vectoreStore.id. This links the created vectore store to the assistant's file search function.


**Create a thread to run the assistant:**
```javascript
const thread = await client.beta.threads.create();

let run = await client.beta.threads.runs.createAndPoll(
    thread.id,
    { 
        assistant_id: assistant.id,
        instructions: "Read the PDF and generate viva questions specific to the PDF",
    }
);
```
- `const thread = await client.beta.threads.create()`: Creates a new thread using the API.
- `let run = await client.beta.threads.runs.createAndPoll`:
   - Starts a new `run` instance within the created thread.
   - `createAndPoll`: The method creats the run and also polls for its completion.
   - Runs the assistant in the thread and instructs it to read the provided PDF and generate Viva questions.

#### 3.2 Handling Responses
Describe the standard structure of API responses, including status codes and format (e.g., JSON, XML).

After the API runs the program, it checks the status and generates Viva questions. The standard structure of an API response is presented below:
```javascript
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
```
- If the run has completed succesfully:
   - `const messages = await client.beta.threads.messages.list(run.thread_id)`: Retrieves messages in the thread associated with the run.
   - `for (const message of messages.data.reverse())`: Loops the message in reverse order. This is done to display the messages in chronological order.
   - `console.log(${message.role} > ${message.content[0].text.value})`: 
      - Prints the role of the sender and the content for each message.
      - `message.content[0].text.value`: Indicates that the text value of the first element is being accessed.
      - Outputs the generated Viva questions.
- If the run was unsuccesful:
   - `console.log(run.status)`: Prints the current status of the run to the console.

#### 3.3 Error Handling
Detail the error codes and messages, their meanings, and recommendations for handling them.

A simlple error handling structure can be represented below: 
```javascript
catch (error) {
  console.error('Error during setup:', error);
}
```
- Catches any error and logs them for troubleshooting.

Other Error codes, messages and recommendations for handling them:
| Error Code | Message | Meaning | Recommendations for handling them |
| ---------- | ------- | ------- | --------------------------------- |
| 401 | Invalid Authentication | Authentication was invalid | Ensure the correct API key and requesting organization are being used |
| 401 | Incorrect API key provided | The requesting API key is not correct | Ensure the correct API key used is being used, clear your browser cache or generate a new one |
| 401 | You must be a member of an organization to use the API | The account is not part of an organization | Contact VivaMQ system to get added to a new organization or ask your organization manager to invite you to an organization |
| 403 | Country, region, or territory not supported | Accessing the API from an unsupported country, region or territory | Please visit VivaMQ Webpage for a list of supported countries, regions or territories |
| 429 | Rate limit reached for requests | Sending requests too quickly | Pace your requests. Visit the VivaMQ Webpage for a rate limit guide |
| 429 | You exceeded your current quota, please check your plan and billing details | You have run out of credits or hit your maximum monthly spend | Purchase a higher tier of API usage |
| 500 | The server had an error while processing your request | Issue on the server | Retry your request after a brief wait and contact VivaMQ if error persists |
| 503 | The engine is currently overloaded, please try again later | Servers are experiencing high traffic | Retry your request after a brief wait |

---

### 4. Best Practices

#### 4.1 Security
Provide guidelines for securely accessing and using the API.
- Store API keys securely.
  - Use environement tools or pasword management tools to securely store API keys. Do not share API keys with anyone. 
- Use HTTPS for all API requests.
  - Use HTTPS to encrypt the data transmitted between the application and the API.

#### 4.2 Performance
Tips for optimizing the usage of the API to ensure performance, such as:
- Efficient use of endpoints.
  - Fetch only the data needed to reduce load.
- Handling API rate limits.
  - Implement retries with exponential backoff when rate limits are encounetered. 

#### 4.3 Data Management
Guidance on managing the data retrieved or sent via the API.
- Data validation.
  - Validate all data sent to the API. Check data types, fields, parameters and ensure that the data meets the API's expected format.
- Data storage.
  - Ensure that the data received from the API is stored securely. Store it in a password protected file or use any form of encryption. 

---

### 5. Technical Details

#### 5.1 Data Models and Schema

##### User
- **ID**: Integer
- **Name**: String
- **Email**: String

##### Item
- **ID**: Integer
- **Name**: String
- **Description**: String
- **Price**: Float

Provide detailed data models/schema for the different resources.

#### 5.2 Sample Use Cases and Code Snippets

##### Use Case: Fetching a List of Users
Provide an example of how to fetch and handle a list of users.
```python
import requests

url = "https://api.example.com/users"
headers = {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())
```

##### Use Case: Creating a New Item
Provide an example of how to create a new item.
```javascript
const axios = require('axios');

const data = {
    name: "Sample Item",
    description: "This is a sample description",
    price: 19.99
};

axios.post('https://api.example.com/items', data, {
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error(error);
});
```

#### 5.3 Common Issues and Troubleshooting
List common issues developers face while integrating the API and provide troubleshooting tips.

- API Key Issues:
  - Ensure the API key is valid, clear browser cache or speak to the organization in charge and generate a new one.
- Rate Limit Exceeded:
  - Implement retry logic with exponential backoff.
  - Do not send too many requests to quickly. Wait for a brief period of time in between sending requests.
- Data formatting issues:
  - Check that the request made matches the expected format for each endpoint. 
---

### 6. Conclusion

Summarize the document, reinforce the benefits of using the API, and provide links to further resources (e.g., detailed API reference, support contacts).

This document provides a comprehensive guide to the VivaMQ AI API component. It addresses the benefits of the API, use cases, error handling, best practices and the limitations. By leveraging OpenAI's powerful AI driven functionalities we are able to automate Viva question generation. For more information, refer to https://platform.openai.com/docs/api-reference/introduction for the full API reference, https://platform.openai.com/docs/quickstart for a developer quickstart or contact VivaMQ. 

---

### 7. Appendix

#### 7.1 Glossary
Define any terms and abbreviations used in the document.
- AI: Artificial Intelligence
- Viva: as known as Viva Voce, is an Interactive Oral Examination
- API: Application Programming Interface
- OAuth: Open Authorization
- JSON: JavaScript Object Notation 
- HTTPS: HyperText Transfer Protocol Secure
- RPM: Requests per Minute 
- TPD: Tokens per Day

#### 7.2 Links and References
Provide links to additional resources, such as:
- Full Open AI API Reference: https://platform.openai.com/docs/api-reference/introduction
- OpenAI API Developer Quickstart: https://platform.openai.com/docs/quickstart 
- OpenAI API Rate Limits: https://platform.openai.com/docs/guides/rate-limits
- OpenAI API Error Codes: https://platform.openai.com/docs/guides/error-codes/api-errors
- Developer Forums
- Support Email

---

### 8. Change Log
Document revisions of the API and this document.
- **Version 1.0**: Initial release
