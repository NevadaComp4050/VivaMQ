# Viva Service Documentation

## Overview

This document provides an overview of the `viva-service.ts` file, which handles the queueing and processing of submission files.

The external-facing function for requesting viva question generation is `queueVivaGeneration(submissionID: string)`. Currently it is called from `/api/submissions/{submissionId}/generate-viva-questions`.

## Key Components

### Dependencies

- **Bull**: A Redis-based queueing system used for handling background tasks.
- **amqplib**: A library for connecting to RabbitMQ.
- **fs**: Used to read submission files from the file system.
- **extractPdfText**: A utility for extracting text from PDF files.

### Constants

- `RABBITMQ_URL`: URL for connecting to the RabbitMQ server.
- `BE_TO_AI_QUEUE`: Queue for sending submissions from the backend to the AI service.
- `AI_TO_BE_QUEUE`: Queue for receiving responses from the AI service.
- `REDIS_CONFIG`: Configuration object for connecting to the Redis server.

## Key Functions

### 1. `async setupQueue()`
This function sets up RabbitMQ and Bull for processing. It connects to RabbitMQ, creates a channel, and asserts the necessary queues. It also creates a Bull task queue (`taskQueue`) for processing submissions and consumes messages from the AI service.

- **Error Handling**: If there's a failure to connect to RabbitMQ or set up queues, the service logs the error and exits the process.

### 2. `async processSubmission(job: Bull.Job)`
This is the main function responsible for processing each submission.

- **Steps**:
  - Retrieve the `submissionID` from the job data.
  - Fetch the submission from the database.
  - Read the submission's PDF file.
  - Extract text from the PDF using `extractTextFromPdf`.
  - Send the extracted text to the AI service via RabbitMQ.

- **Error Handling**: The function throws an error if the submission is not found or the file cannot be read.

### 3. `async handleAIResponse(msg: amqp.Message | null)`
This function handles incoming responses from the AI service.

- **Steps**:
  - Parse the message received from the AI service.
  - Extract the generated viva question and its associated id from the response from AI.
  - Save the viva question to the database.

### 4. `async queueVivaGeneration(submissionID: string)`
This is the **externally callable** function for queueing viva generation. 

- **Steps**:
  - Logs the submission ID.
  - Ensures the task queue is set up.
  - Adds a job to the taskQueue with the submission ID.

### 5. `async sendToAIService(submission: string, uuid: string)`
This function sends a submission's text and UUID to the AI service.

- **Steps**:
  - Prepares a message by serialising the submission text and UUID.
  - Sends the message to the RabbitMQ queue designated for AI communication.

## Usage

The only function that should be called externally to request viva generation is:

```ts
queueVivaGeneration(submissionID: string);
```

### Example

To queue a submission for viva question generation:

```ts
import { queueVivaGeneration } from './services/viva-service';

const submissionID = 'submission-id';
await queueVivaGeneration(submissionID);
```

This will initiate the following:
1. The submission ID is added to the Bull task queue.
2. The task queue processes the submission, reads the associated PDF file, and extracts the text.
3. The text is sent to the AI service via RabbitMQ.
4. The AI service generates viva questions and sends a response back via RabbitMQ.
5. The AI response is handled, and the generated question is saved to the database.

## Error Handling

- Errors encountered during PDF extraction or AI communication are logged and thrown.


###

### AI Disclosure
This document was formatted using AI, from a handwritten draft.