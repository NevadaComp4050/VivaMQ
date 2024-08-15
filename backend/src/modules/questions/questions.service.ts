import { Questions } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import {
  generateQuestionsForFiles,
  regenerateQuestionsForFile,
  regenerateSingleQuestionForFile,
} from '@/utils/questionGenerator';
import { CreateQuestionDto, UpdateQuestionDto } from '@/dto/question.dto';

export default class QuestionService {
  //@LogMessage<{ fileId: string }>({ message: 'Generating questions for file(s)' })
  public async generateQuestions(fileIds: string[]) {
    const questions = await generateQuestionsForFiles(fileIds);

    const createdQuestions = await prisma.questions.createMany({
      data: questions.map((questionData) => ({
        fileId: questionData.fileId,
        question: questionData.question,
        locked: false,
        asked: false,
      })),
    });

    return createdQuestions;
  }

  //@LogMessage<{ fileId: string }>({ message: 'Regenerating questions for file' })
  public async regenerateQuestions(fileId: string) {
    const questions = await regenerateQuestionsForFile(fileId);

    // Deleting all existing questions for the file
    await prisma.questions.deleteMany({
      where: { fileId },
    });

    // Regenerating and inserting new questions
    const createdQuestions = await prisma.questions.createMany({
      data: questions.map((question) => ({
        fileId,
        question,
        locked: false,
        asked: false,
      })),
    });

    return createdQuestions;
  }

  //@LogMessage<{ fileId: string }>({ message: 'Regenerating single question for file' })
  public async regenerateSingleQuestion(fileId: string) {
    const question = await regenerateSingleQuestionForFile(fileId);

    const createdQuestion = await prisma.questions.create({
      data: {
        fileId,
        question,
        locked: false,
        asked: false,
      },
    });

    return createdQuestion;
  }

  //@LogMessage<{ id: string }>({ message: 'Updating question' })
  public async updateQuestion(id: string, data: Partial<UpdateQuestionDto>) {
    const updatedQuestion = await prisma.questions.update({
      where: { id },
      data,
    });

    return updatedQuestion;
  }

  //@LogMessage<{ id: string }>({ message: 'Creating question' })
  public async createQuestion(data: CreateQuestionDto) {
    const createdQuestion = await prisma.questions.create({
      data,
    });

    return createdQuestion;
  }
}
