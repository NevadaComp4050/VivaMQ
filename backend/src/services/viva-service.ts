import amqp from 'amqplib';
import { type VivaQuestion } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';

import { Message } from "./../../../ai-processor/src/types"
import { error } from 'console';

/**
 * TODO for this file:
 * - [x] Update the code to integrate with the new AI system.
 * - [ ] Implement functionality for regenerating questions.
 * - [x] Investigate removal of Bull as a dependency if no longer required.
 */

const RABBITMQ_URL_DEFAULT = "amqp://user:password@rabbitmq:5672";
// const RABBITMQ_URL = 'amqp://localhost'; // URL for connecting to RabbitMQ server.
const RABBITMQ_URL = process.env.RABBITMQ_URL || RABBITMQ_URL_DEFAULT;
const BE_TO_AI_QUEUE = 'BEtoAI'; // Queue name for sending messages from the backend to the AI service.
const AI_TO_BE_QUEUE = 'AItoBE'; // Queue name for receiving messages from the AI service back to the backend.

let connection: amqp.Connection; // Holds the RabbitMQ connection.
let channel: amqp.Channel; // RabbitMQ channel for communication.

// Set up the RabbitMQ connection and channels
/**
 * Configures the RabbitMQ connector using the RabbitMQ URL.
 * Sends on channel `BEtoAI` recieves on channel `AItoBE`, using 
 * the function {@linkcode handleAIResponse }
 */
async function setupQueue() {
  try {
    // Establish connection to RabbitMQ and create a channel.
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Ensure that both queues (BEtoAI and AItoBE) exist and are durable.
    await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
    await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

    // Start consuming messages from the AItoBE queue and process them with the handleAIResponse function.
    void channel.consume(AI_TO_BE_QUEUE, handleAIResponse, { noAck: false });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    // TODO Remove this? @ryankontos
    // process.exit(1); // Exit the process if queue setup fails.
  }
}

// Function to process the submission directly using RabbitMQ
async function processSubmission(submissionID: string) {
  console.log('Processing submission:', submissionID);

  // Fetch the submission record from the database using the Prisma client.
  const submission = await prisma.submission.findUnique({
    where: { id: submissionID },
  });
  // ERROR: If the submission is not found, throw an error.
  if (!submission) {
    throw new Error(`Submission with ID ${submissionID} not found`);
  }

  // ERROR: Fetch the text content of the submission file.
  const submissionFileLookupResult = await fetchSubmissionText(submissionID);
  if (!submissionFileLookupResult) {
    throw new Error(`File result for submission ${submissionID} not found`);
  }

  // ERROR: If no text is found in the submission file, log an error and exit the function.
  const submissionText = submissionFileLookupResult.text;
  if (!submissionText) {
    console.error(`No text found for submission ${submissionID}`);
    return;
  }

  console.log('Valid Submission found:', submission);

  try {
    // Send the text to the AI service for processing.
    // await sendToAIService(submissionText, submissionID);
    let message;
    message.data.submission = submissionText;
    message.uuid = submissionID;
    message.type = "vivaQuestions";
    await sendAIMessage(message)
  } catch (error: unknown) {
    // Log any errors that occur during communication with the AI service.
    if (error instanceof Error) {
      console.error(`Error during AI communication: ${error.message}`);
    } else {
      console.error('Error during PDF extraction or AI communication:', error);
    }
    throw error; // Re-throw the error to allow error handling upstream.
  }
}

// Handle the response message from the AI service.
async function handleAIResponse(msg: amqp.Message | null) {
  if (!msg) return; // Return immediately if the message is null.

  const response = JSON.parse(msg.content.toString());
  const [message, uuid] = response; // Destructure the AI's response to extract message and UUID.

  console.log('Received AI response:', uuid);

  channel.ack(msg); // Acknowledge the message to remove it from the queue.

  const vivaId = uuidv4(); // Generate a new unique ID for the viva question.

  const vivaQuestion: VivaQuestion = {
    id: vivaId,
    submissionId: uuid,
    question: message,
    status: 'GENERATED',
  };

  // Save the generated viva question to the database using Prisma.
  await prisma.vivaQuestion.create({ data: vivaQuestion });

  console.log('Viva question saved. ID:', vivaId);
}

// Add a submission to the queue for processing using RabbitMQ.
export async function queueVivaGeneration(submissionID: string) {
  console.log('Queueing submission for viva generation:', submissionID);
  if (!connection || !channel) await setupQueue(); // Ensure the queue is set up before adding jobs.
  await processSubmission(submissionID); // Directly process the submission using RabbitMQ.
}

// Send the submission text to the AI service via RabbitMQ.
export async function sendToAIService(submission: string, uuid: string) {
  const sendMsg = Buffer.from(JSON.stringify([submission, uuid])); // Create a message buffer.
  console.log('Sending submission to AI service:', uuid);
  channel.sendToQueue(BE_TO_AI_QUEUE, sendMsg); // Send the message to the BEtoAI queue.
}

export async function sendAIMessage(message: Message) {
  try{
    if(!message.uuid){
      throw new error('messages must be identifiable.');
    } else if (!message.data) {
      throw new error('messages must have content.');
    } else if (!message.type){
      throw new error('messages must have a type.');
    }
    console.log('Sent message to AI');
    const sendMsg = Buffer.from(JSON.stringify(message));
    channel.sendToQueue(BE_TO_AI_QUEUE, sendMsg);
  } catch (e) {
    console.error(`Error in sendAIMessage: ${e.message}`)
  }
}