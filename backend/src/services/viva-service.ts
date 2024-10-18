import Bull from 'bull';
import amqp from 'amqplib';
import { type VivaQuestion } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';

const RABBITMQ_URL = 'amqp://localhost';
const BE_TO_AI_QUEUE = 'BEtoAI';
const AI_TO_BE_QUEUE = 'AItoBE';
const REDIS_CONFIG = { host: '127.0.0.1', port: 6379 };

let connection: amqp.Connection;
let channel: amqp.Channel;
let taskQueue: Bull.Queue;

async function setupQueue() {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();

    await channel.assertQueue(BE_TO_AI_QUEUE, { durable: true });
    await channel.assertQueue(AI_TO_BE_QUEUE, { durable: true });

    taskQueue = new Bull('taskQueue', { redis: REDIS_CONFIG });

    void taskQueue.process(processSubmission);

    void channel.consume(AI_TO_BE_QUEUE, handleAIResponse, { noAck: false });
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
}

async function processSubmission(job: Bull.Job) {
  const submissionID: string = job.data.submissionID;

  console.log('Processing submission:', submissionID);

  const submission = await prisma.submission.findUnique({
    where: { id: submissionID },
  });
  if (!submission)
    throw new Error(`Submission with ID ${submissionID} not found`);

  console.log('Submission found:', submission);

  const submissionFileLookupResult = await fetchSubmissionText(submissionID);
  if (!submissionFileLookupResult)
    throw new Error(`File result for submission ${submissionID} not found`);

  const submissionText = submissionFileLookupResult.text;

  if (!submissionText) {
    console.error(`No text found for submission ${submissionID}`);
    return;
  }

  try {
    await sendToAIService(submissionText, submissionID);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error during AI communication: ${error.message}`);
    } else {
      console.error('Error during PDF extraction or AI communication:', error);
    }
    throw error;
  }
}

async function handleAIResponse(msg: amqp.Message | null) {
  if (!msg) return;

  const response = JSON.parse(msg.content.toString());
  const [message, uuid] = response;

  console.log('Received AI response:', uuid);

  channel.ack(msg);

  const vivaId = uuidv4();

  const vivaQuestion: VivaQuestion = {
    id: vivaId,
    submissionId: uuid,
    question: message,
    status: 'GENERATED',
  };

  await prisma.vivaQuestion.create({ data: vivaQuestion });

  console.log('Viva question saved. ID:', vivaId);
}

export async function queueVivaGeneration(submissionID: string) {
  console.log('Queueing submission for viva generation:', submissionID);
  if (!taskQueue) await setupQueue();
  await taskQueue.add({ submissionID });
}

export async function sendToAIService(submission: string, uuid: string) {
  const sendMsg = Buffer.from(JSON.stringify([submission, uuid]));
  console.log('Sending submission to AI service:', uuid);
  channel.sendToQueue(BE_TO_AI_QUEUE, sendMsg);
}
