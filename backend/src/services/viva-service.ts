// viva-service.ts
import amqp from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { type Prisma, RubricStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';

import { type Message, type CreateRubricMessage } from '@/types/message';

const RABBITMQ_URL_DEFAULT = 'amqp://user:password@rabbitmq:5672';
const RABBITMQ_URL = process.env.RABBITMQ_URL ?? RABBITMQ_URL_DEFAULT;
const BE_TO_AI_QUEUE = `${process.env.NODE_ENV ?? 'development'}_${process.env.uniqueID ?? 'defaultID'}_BEtoAI`;
const AI_TO_BE_QUEUE = `${process.env.NODE_ENV ?? 'development'}_${process.env.uniqueID ?? 'defaultID'}_AItoBE`;

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

      console.log('Sending on queue:', BE_TO_AI_QUEUE);
      console.log('Listening on queue:', AI_TO_BE_QUEUE);

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

export async function submitRubricCreation(
  createRubricMessage: CreateRubricMessage
) {
  try {
    // Directly send the message to AI service without creating a new rubric
    await sendToAIService(createRubricMessage);
  } catch (error) {
    console.error('Error submitting rubric creation to AI service:', error);

    // Set the status to ERROR if submission fails
    if (createRubricMessage?.uuid) {
      await prisma.rubric.update({
        where: { id: createRubricMessage.uuid },
        data: { status: RubricStatus.ERROR },
      });
    }
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
    } else if (type === 'createRubric') {
      await handleCreateRubric(data, uuid);
      sentUUIDs.delete(uuid); // Remove the UUID after processing
    } else if (type === 'error') {
      console.error('Error from AI service:', data);

      // Update vivaStatus to ERROR or Rubric status to ERROR based on context
      await prisma.submission.update({
        where: { id: uuid },
        data: { vivaStatus: 'ERROR' },
      });

      await prisma.rubric.updateMany({
        where: { id: uuid },
        data: { status: RubricStatus.ERROR },
      });
    } else {
      console.warn(`Unhandled message type: ${type}`);
    }
  } catch (error) {
    console.error('Failed to parse nested data as JSON:', error);

    // Update vivaStatus to ERROR or Rubric status to ERROR based on context
    await prisma.submission.update({
      where: { id: uuid },
      data: { vivaStatus: 'ERROR' },
    });

    await prisma.rubric.updateMany({
      where: { id: uuid },
      data: { status: RubricStatus.ERROR },
    });
  }
}

// Handle viva question creation and update assignment
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
            category: String(question.question_category),
            status: 'GENERATED',
          };

          await prisma.vivaQuestion.create({ data: vivaQuestion });
          console.log('Viva question saved. ID:', vivaId);
        } else {
          console.warn('Invalid question structure:', question);
        }
      }

      // Update vivaStatus to COMPLETED after all questions are created
      const submission = await prisma.submission.update({
        where: { id: uuid },
        data: { vivaStatus: 'COMPLETED' },
        include: { assignment: true },
      });

      // Update the latestVivaUpdate field of the related assignment
      if (submission.assignment) {
        await prisma.assignment.update({
          where: { id: submission.assignment.id },
          data: { latestVivaUpdate: new Date() },
        });
      }
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

// Handle createRubric responses from AI service
async function handleCreateRubric(data: any, uuid: string) {
  console.log('Handling createRubric response:', data);
  try {
    // Update the Rubric in the database with the generated data
    const updatedRubric = await prisma.rubric.update({
      where: { id: uuid },
      data: {
        rubricData: data,
        status: RubricStatus.COMPLETED,
        // dataModifiedAt will be auto-updated by Prisma
      },
      include: { assignment: true },
    });

    // Update the related assignment (this will trigger the automatic update of dataModifiedAt)
    if (updatedRubric.assignment) {
      await prisma.assignment.update({
        where: { id: updatedRubric.assignment.id },
        data: { description: updatedRubric.title }, // Example change to trigger dataModifiedAt update
      });
    }

    console.log('Rubric updated with AI-generated data:', updatedRubric);
  } catch (error) {
    console.error('Error handling createRubric response:', error);

    // Update Rubric status to ERROR
    await prisma.rubric.update({
      where: { id: uuid },
      data: { status: RubricStatus.ERROR },
    });
  }
}

// Send message to AI service queue
async function sendToAIService(message: Message | CreateRubricMessage) {
  await sendToQueue(message, BE_TO_AI_QUEUE);
}

// Helper function to send messages to a specified queue
async function sendToQueue(message: object, queue: string) {
  const sendMsg = Buffer.from(JSON.stringify(message));
  if (channel) {
    channel.sendToQueue(queue, sendMsg, { persistent: true });
    console.log(`Message sent to ${queue}:`, message);
  }
}

// Initialize queue setup
setupQueue().catch((error) => {
  console.error('Error during RabbitMQ setup:', error);
});

export default {
  submitSubmission,
  submitRubricCreation,
};
