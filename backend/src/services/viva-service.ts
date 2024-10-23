import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';

import { type Message } from '@/types/message';

const RABBITMQ_URL_DEFAULT = 'amqp://user:password@rabbitmq:5672';
const RABBITMQ_URL = process.env.RABBITMQ_URL ?? RABBITMQ_URL_DEFAULT;
const BE_TO_AI_QUEUE = 'BEtoAI';
const AI_TO_BE_QUEUE = 'AItoBE';

let connection: amqp.Connection | null = null;
let channel: amqp.Channel | null = null;
const sentUUIDs = new Set<string>();

// Set up the RabbitMQ connection and channels
export async function setupQueue() {
  try {
    if (!channel) {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      // Ensure queues exist and are durable
      await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
      await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

      // Start consuming messages from AItoBE queue
      await channel.consume(AI_TO_BE_QUEUE, handleAIResponse, { noAck: false });
      console.log('RabbitMQ connected and queues set up.');
    }
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
}

// Function to process the submission using RabbitMQ
export async function submitSubmission(submissionID: string) {
  console.log('Processing submission:', submissionID);

  try {
    // Fetch submission data
    const submission = await prisma.submission.findUnique({
      where: { id: submissionID },
    });
    if (!submission)
      throw new Error(`Submission with ID ${submissionID} not found`);

    // Fetch submission text
    const submissionFileLookupResult = await fetchSubmissionText(submissionID);
    if (!submissionFileLookupResult?.text) {
      throw new Error(`No text found for submission ${submissionID}`);
    }

    // Update vivaStatus to INPROGRESS
    await prisma.submission.update({
      where: { id: submissionID },
      data: { vivaStatus: 'INPROGRESS' },
    });

    const message: Message = {
      type: 'vivaQuestions',
      data: { submission: submissionFileLookupResult.text, customPrompt: null },
      uuid: submissionID,
    };

    // Store the UUID of the sent message
    sentUUIDs.add(submissionID);

    // Send message to AI service
    await sendToAIService(message);
  } catch (error) {
    console.error('Error processing submission:', error);

    // Update vivaStatus to ERROR
    await prisma.submission.update({
      where: { id: submissionID },
      data: { vivaStatus: 'ERROR' },
    });
  }
}

// Handle the response from the AI service
async function handleAIResponse(msg: amqp.Message | null) {
  if (!msg) return;

  let response;
  try {
    response = JSON.parse(msg.content.toString());
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    if (channel) channel.ack(msg);
    return;
  }

  const {
    type,
    data: rawData,
    uuid,
  }: { type: string; data: any; uuid: string } = response;

  if (channel) channel.ack(msg);

  try {
    const data =
      Array.isArray(rawData) && typeof rawData[0] === 'string'
        ? JSON.parse(rawData[0])
        : rawData;

    if (type === 'vivaQuestions') {
      await handleVivaQuestions(data, uuid);
      sentUUIDs.delete(uuid); // Remove the UUID after processing
    } else if (type === 'error') {
      console.error('Error from AI service:', data);

      // Update vivaStatus to ERROR
      await prisma.submission.update({
        where: { id: uuid },
        data: { vivaStatus: 'ERROR' },
      });
    } else {
      console.warn(`Unhandled message type: ${type}`);
    }
  } catch (error) {
    console.error('Failed to parse nested data as JSON:', error);

    // Update vivaStatus to ERROR
    await prisma.submission.update({
      where: { id: uuid },
      data: { vivaStatus: 'ERROR' },
    });
  }
}

// Handle viva questions from the AI service
async function handleVivaQuestions(data: any, uuid: string) {
  if (Array.isArray(data?.questions) && data.questions.length > 0) {
    try {
      for (const question of data.questions) {
        if (question?.question_text) {
          const vivaId = uuidv4();
          const vivaQuestion: Prisma.VivaQuestionCreateInput = {
            id: vivaId,
            submission: { connect: { id: uuid } },
            question: question.question_text as Prisma.InputJsonValue,
            status: 'GENERATED',
          };

          await prisma.vivaQuestion.create({ data: vivaQuestion });
          console.log('Viva question saved. ID:', vivaId);
        } else {
          console.warn('Invalid question structure:', question);
        }
      }

      // Update vivaStatus to COMPLETED after all questions are created
      await prisma.submission.update({
        where: { id: uuid },
        data: { vivaStatus: 'COMPLETED' },
      });
    } catch (error) {
      console.error('Error saving viva question:', error);

      // Update vivaStatus to ERROR
      await prisma.submission.update({
        where: { id: uuid },
        data: { vivaStatus: 'ERROR' },
      });
    }
  } else {
    console.warn(
      `No valid questions found in response for submission: ${uuid}`
    );
  }
}

// Send message to AI service queue
async function sendToAIService(message: Message) {
  await sendToQueue(message, BE_TO_AI_QUEUE);
}

// Helper function to send messages to a specified queue
async function sendToQueue(message: object, queue: string) {
  const sendMsg = Buffer.from(JSON.stringify(message));
  if (channel) {
    channel.sendToQueue(queue, sendMsg);
    console.log(`Message sent to ${queue}:`, message);
  }
}

// Initialize queue setup
setupQueue().catch((error) => {
  console.error('Error during RabbitMQ setup:', error);
});
