// /Users/ryankontos/VivaMQ/backend/src/services/ai-service/handlers/vivaHandler.ts

import { v4 as uuidv4 } from 'uuid';
import { VIVASTATUS, type Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

const STATUS = {
  ERROR: 'ERROR',
  COMPLETED: 'COMPLETED',
  GENERATED: 'GENERATED',
};

// Helper function to update the submission status
async function updateSubmissionStatus(uuid: string, status: VIVASTATUS) {
  await prisma.submission.update({
    where: { id: uuid },
    data: { vivaStatus: status },
  });
}

// Helper function to validate the question structure
function isValidQuestion(question: any): boolean {
  return question?.question_text && question?.question_category;
}

// Helper function to save a viva question to the database
async function saveVivaQuestion(submissionID: string, question: any) {
  const vivaId = uuidv4();
  const vivaQuestion: Prisma.VivaQuestionCreateInput = {
    id: vivaId,
    submission: { connect: { id: submissionID } },
    question: question.question_text as Prisma.InputJsonValue,
    category: String(question.question_category),
    status: STATUS.GENERATED,
  };

  await prisma.vivaQuestion.create({ data: vivaQuestion });
  console.log('Viva question saved. ID:', vivaId);
}

// Handler function for processing viva question responses
export async function handleVivaQuestions(
  data: any,
  uuid: string,
  requestType: string | null
) {
  console.log('Viva Questions Response (raw):', data);
  console.log('Handling request type:', requestType);

  if (requestType === 'vivaQuestionRegeneration') {
    await handleVivaQuestionRegeneration(data, uuid);
  } else {
    await handleSubmissionVivaQuestions(data, uuid);
  }
}

// Function to handle viva question regeneration
async function handleVivaQuestionRegeneration(
  data: any,
  vivaQuestionID: string
) {
  console.log(`Handling viva question regeneration for ID: ${vivaQuestionID}`);

  let parsedData;
  try {
    parsedData = JSON.parse(data); // Parse data directly
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    await prisma.vivaQuestion.update({
      where: { id: vivaQuestionID },
      data: { status: STATUS.ERROR },
    });
    return;
  }

  if (
    !Array.isArray(parsedData?.questions) ||
    parsedData.questions.length === 0
  ) {
    console.warn(
      `No valid questions found in AI response for ID: ${vivaQuestionID}`
    );
    await prisma.vivaQuestion.update({
      where: { id: vivaQuestionID },
      data: { status: STATUS.ERROR },
    });
    return;
  }

  // Fetch the original viva question to get its category
  const originalVivaQuestion = await prisma.vivaQuestion.findUnique({
    where: { id: vivaQuestionID },
  });

  if (!originalVivaQuestion) {
    console.error(`Original viva question not found for ID: ${vivaQuestionID}`);
    return;
  }

  const originalCategory = originalVivaQuestion.category;

  // Find a question in the AI response with a matching category
  const matchingQuestion = parsedData.questions.find(
    (question: any) => question?.question_category === originalCategory
  );

  if (matchingQuestion) {
    try {
      // Update the original viva question with the new question details
      await prisma.vivaQuestion.update({
        where: { id: vivaQuestionID },
        data: {
          question: matchingQuestion.question_text,
          category: matchingQuestion.question_category,
          status: STATUS.COMPLETED,
        },
      });
      console.log(
        `Viva question regenerated successfully for ID: ${vivaQuestionID}`
      );
    } catch (error) {
      console.error('Error updating regenerated viva question:', error);
      await prisma.vivaQuestion.update({
        where: { id: vivaQuestionID },
        data: { status: STATUS.ERROR },
      });
    }
  } else {
    console.warn('No matching question found in AI response');
    await prisma.vivaQuestion.update({
      where: { id: vivaQuestionID },
      data: { status: STATUS.ERROR },
    });
  }
}

async function handleSubmissionVivaQuestions(data: any, submissionID: string) {
  console.log(`Handling viva questions for submission: ${submissionID}`);

  let parsedData;
  try {
    parsedData = JSON.parse(data); // Parse data directly
  } catch (parseError) {
    console.error('Failed to parse AI response:', parseError);
    await updateSubmissionStatus(submissionID, VIVASTATUS.ERROR);
    return;
  }

  if (
    !Array.isArray(parsedData?.questions) ||
    parsedData.questions.length === 0
  ) {
    console.warn(
      `No valid questions found in AI response for submission: ${submissionID}`
    );
    await updateSubmissionStatus(submissionID, VIVASTATUS.ERROR);
    return;
  }

  // Retrieve locked categories for this submission
  const { lockedCategories } = await prisma.submission.findUniqueOrThrow({
    where: { id: submissionID },
    select: { lockedCategories: true },
  });

  // Process each question, skipping locked categories
  for (const question of parsedData.questions) {
    if (
      isValidQuestion(question) &&
      !lockedCategories.includes(question.question_category)
    ) {
      await saveVivaQuestion(submissionID, question);
    } else if (!isValidQuestion(question)) {
      console.warn('Invalid question structure:', question);
    }
  }

  // Update submission status to COMPLETED
  await updateSubmissionStatus(submissionID, VIVASTATUS.COMPLETED);
}
