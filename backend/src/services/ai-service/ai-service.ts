import { RubricStatus } from '@prisma/client';
import { setupQueue, sendToQueue } from './utils/rabbitmq';
import { dispatchMessage } from './dispatcher';
import { BE_TO_AI_QUEUE } from './config';
import prisma from '@/lib/prisma';
import { fetchSubmissionText } from '@/utils/fetch-submission-text';
import { type Message, type CreateRubricMessage } from '@/types/message';

const sentUUIDs = new Set<string>();

// Set up the RabbitMQ connection and message dispatching
setupQueue(dispatchMessage).catch((error) => {
  console.error('Error during RabbitMQ setup:', error);
});

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
    await sendToQueue(message, BE_TO_AI_QUEUE);
  } catch (error) {
    console.error('Error processing submission:', error);

    // Update vivaStatus to ERROR
    await prisma.submission.update({
      where: { id: submissionID },
      data: { vivaStatus: 'ERROR' },
    });
  }
}

// Function to submit rubric creation to the AI service
export async function submitRubricCreation(
  createRubricMessage: CreateRubricMessage
) {
  try {
    // Directly send the message to AI service without creating a new rubric
    await sendToQueue(createRubricMessage, BE_TO_AI_QUEUE);
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

// Export the service functions
export default {
  submitSubmission,
  submitRubricCreation,
};
