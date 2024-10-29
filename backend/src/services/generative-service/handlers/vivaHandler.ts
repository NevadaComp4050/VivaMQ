import { v4 as uuidv4 } from 'uuid';
import { type Prisma, type VIVASTATUS } from '@prisma/client';
import prisma from '@/lib/prisma';

const STATUS = {
  ERROR: 'ERROR',
  COMPLETED: 'COMPLETED',
  GENERATED: 'GENERATED',
};

async function updateSubmissionStatus(uuid: string, status: string) {
  await prisma.submission.update({
    where: { id: uuid },
    data: { vivaStatus: status as VIVASTATUS },
  });
}

function isValidQuestion(question: any): boolean {
  return question?.question_text && question?.question_category;
}

async function saveVivaQuestion(uuid: string, question: any) {
  const vivaId = uuidv4();
  const vivaQuestion: Prisma.VivaQuestionCreateInput = {
    id: vivaId,
    submission: { connect: { id: uuid } },
    question: question.question_text as Prisma.InputJsonValue,
    category: String(question.question_category),
    status: STATUS.GENERATED,
  };

  await prisma.vivaQuestion.create({ data: vivaQuestion });
  console.log('Viva question saved. ID:', vivaId);
}

export async function handleVivaQuestions(data: any, uuid: string) {
  console.log('Viva Questions Response (raw):', data);

  if (!Array.isArray(data) || typeof data[0] !== 'string') {
    console.error('Data is not in the expected format:', data);
    await updateSubmissionStatus(uuid, STATUS.ERROR);
    return;
  }

  let parsedData;
  try {
    parsedData = JSON.parse(data[0]);
  } catch (parseError) {
    console.error('Failed to parse data:', parseError);
    await updateSubmissionStatus(uuid, STATUS.ERROR);
    return;
  }

  if (
    !Array.isArray(parsedData?.questions) ||
    parsedData.questions.length === 0
  ) {
    console.warn(
      `No valid questions found in response for submission: ${uuid}`
    );
    await updateSubmissionStatus(uuid, STATUS.ERROR);
    return;
  }

  try {
    for (const question of parsedData.questions) {
      if (isValidQuestion(question)) {
        await saveVivaQuestion(uuid, question);
      } else {
        console.warn('Invalid question structure:', question);
      }
    }
    await updateSubmissionStatus(uuid, STATUS.COMPLETED);
  } catch (error) {
    console.error('Error saving viva question:', error);
    await updateSubmissionStatus(uuid, STATUS.ERROR);
  }
}
