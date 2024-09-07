import Bull from 'bull';
import amqp from 'amqplib';
import prisma from '@/lib/prisma';
import { type Submission, type VivaQuestion } from '@prisma/client';
import fs from 'fs';
import extractTextFromPdf from './utils/extractPdfText';
import {v4 as uuidv4} from 'uuid';

const RABBITMQ_URL = 'amqp://localhost';
const BE_TO_AI_QUEUE = 'BEtoAI';
const AI_TO_BE_QUEUE = 'AItoBE';
const REDIS_CONFIG = { host: '127.0.0.1', port: 6379 };
const AI_RESPONSE_TIMEOUT = 5000;

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

    taskQueue.process(processSubmission);

    channel.consume(
      AI_TO_BE_QUEUE,
      handleAIResponse,
      { noAck: false }
    );
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
}

async function processSubmission(job: Bull.Job) {
  
  const submissionID = job.data.submissionID;

  console.log('Processing submission:', submissionID);

  const submission = await prisma.submission.findUnique({ where: { id: submissionID } });
  if (!submission) throw new Error(`Submission with ID ${submissionID} not found`);

  console.log('Submission found:', submission);

  const { submissionFile } = submission;
  if (!submissionFile) throw new Error(`Submission with ID ${submissionID} has no file`);

  console.log('Reading submission file:', submissionFile);

  const submissionFileContent = fs.readFileSync(submissionFile);
  if (!submissionFileContent) throw new Error(`Error reading file for submission ID ${submissionID}`);

  try {
    const submissionText = await extractTextFromPdf(submissionFileContent);
    await sendToAIService(submissionText, submissionID);
  } catch (error) {
    console.error(`Error during PDF extraction or AI communication: ${error}`);
    throw error;
  }
}

async function handleAIResponse(msg: amqp.Message | null) {
  if (!msg) return;

  const response = JSON.parse(msg.content.toString());
  const [message, uuid] = response;
  
  console.log('Received AI response:', uuid);

  channel.ack(msg);

  let vivaId = uuidv4();

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
