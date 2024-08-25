System Interface Document

# Question Generator Microservice - System Interface Document

## 1. Overview

The Question Generator Microservice is designed to process documents and generate relevant viva questions using OpenAI's GPT-4 model. It communicates with other services via RabbitMQ message queues.

## 2. System Architecture

The microservice is part of a larger system that includes:

- Frontend service
- Backend service
- MySQL database
- RabbitMQ message broker
- Question Generator Microservice

## 3. Interfaces

### 3.1 Input Interface

- Protocol: AMQP (Advanced Message Queuing Protocol)
- Queue Name: `document_processing`
- Message Format: JSON
- Message Structure:
  ```json
  {
    "documentId": "string",
    "documentContent": "string"
  }
  ```

### 3.2 Output Interface

The microservice processes the input and generates questions. The output is currently logged to the console. To integrate with other services, implement a method to send the results to another RabbitMQ queue or store them in the database.

## 4. Dependencies

- Node.js (v14 or later)
- RabbitMQ
- OpenAI API

## 5. Configuration

The microservice uses the following environment variables:

- `RABBITMQ_URL`: The URL to connect to RabbitMQ
- `OPENAI_API_KEY`: Your OpenAI API key

## 6. Error Handling

- If message processing fails, the message is nacked and requeued in RabbitMQ.
- Errors are logged to the console.

## 7. Scalability

The microservice can be scaled horizontally by running multiple instances. RabbitMQ will distribute messages among the instances.

## 8. Security

- Ensure that the RabbitMQ connection uses authentication.
- Keep the OpenAI API key secure and never expose it in logs or client-side code.

## 9. Monitoring

Implement logging and monitoring to track:
- Number of messages processed
- Processing time per message
- Error rates
- RabbitMQ queue length
