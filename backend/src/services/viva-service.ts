import Bull from 'bull';
import amqp from 'amqplib';
import { type VivaQuestion } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';

/**
 * TODO for this file:
 * - Update the code to integrate with the new AI system.
 * - Implement functionality for regenerating questions.
 * - Investigate removing Bull as a dependency if no longer required.
 */

const RABBITMQ_URL = 'amqp://localhost'; // URL for connecting to RabbitMQ server.
const BE_TO_AI_QUEUE = 'BEtoAI'; // Queue name for sending messages from the backend to the AI service.
const AI_TO_BE_QUEUE = 'AItoBE'; // Queue name for receiving messages from the AI service back to the backend.
const REDIS_CONFIG = { host: '127.0.0.1', port: 6379 }; // Configuration for Redis connection used by Bull.

let connection: amqp.Connection; // Holds the RabbitMQ connection.
let channel: amqp.Channel; // RabbitMQ channel for communication.
let taskQueue: Bull.Queue; // Bull queue for managing job processing.

async function setupQueue() {
  try {
    // Establish connection to RabbitMQ and create a channel.
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    // Ensure that both queues (BEtoAI and AItoBE) exist and are durable.
    await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
    await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

    // Initialize a Bull queue to handle task processing.
    taskQueue = new Bull('taskQueue', { redis: REDIS_CONFIG });

    // Start processing jobs in the Bull queue using the processSubmission function.
    void taskQueue.process(processSubmission);

    // Consume messages from the AItoBE queue and handle them with the handleAIResponse function.
    void channel.consume(AI_TO_BE_QUEUE, handleAIResponse, { noAck: false });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1); // Exit the process if queue setup fails.
  }
}

async function processSubmission(job: Bull.Job) {
  const submissionID: string = job.data.submissionID; // Extract the submission ID from the job data.

  console.log('Processing submission:', submissionID);

  // Fetch the submission record from the database using the Prisma client.
  const submission = await prisma.submission.findUnique({
    where: { id: submissionID },
  });

  // If the submission is not found, throw an error.
  if (!submission)
    throw new Error(`Submission with ID ${submissionID} not found`);

  console.log('Submission found:', submission);

  // Fetch the text content of the submission file.
  const submissionFileLookupResult = await fetchSubmissionText(submissionID);
  if (!submissionFileLookupResult)
    throw new Error(`File result for submission ${submissionID} not found`);

  const submissionText = submissionFileLookupResult.text;

  // If no text is found in the submission file, log an error and exit the function.
  if (!submissionText) {
    console.error(`No text found for submission ${submissionID}`);
    return;
  }

  try {
    // Send the text to the AI service for processing.
    await sendToAIService(submissionText, submissionID);
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

// Queue a submission ID for processing by adding it to the Bull task queue.
export async function queueVivaGeneration(submissionID: string) {
  console.log('Queueing submission for viva generation:', submissionID);
  if (!taskQueue) await setupQueue(); // Ensure the queue is set up before adding jobs.
  await taskQueue.add({ submissionID }); // Add the submission ID to the queue.
}

// Send the submission text to the AI service via RabbitMQ.
export async function sendToAIService(submission: string, uuid: string) {
  const sendMsg = Buffer.from(JSON.stringify([submission, uuid])); // Create a message buffer.
  console.log('Sending submission to AI service:', uuid);
  channel.sendToQueue(BE_TO_AI_QUEUE, sendMsg); // Send the message to the BEtoAI queue.
}