import { type VivaQuestion } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import { requestVivaQuestionRegeneration } from '@/services/ai-service/ai-service';

export default class VivaQuestionService {
  @LogMessage<[VivaQuestion]>({ message: 'test-decorator' })
  public async create(data: VivaQuestion) {
    const vivaQuestion = await prisma.vivaQuestion.create({
      data: {
        ...data,
        question: JSON.stringify(data.question),
      },
    });
    return vivaQuestion;
  }

  public async get(id: string) {
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id },
    });
    return vivaQuestion;
  }

  public async getAll() {
    const vivaQuestions = await prisma.vivaQuestion.findMany();
    return vivaQuestions;
  }

  public async delete(id: string) {
    const vivaQuestion = await prisma.vivaQuestion.delete({
      where: { id },
    });
    return vivaQuestion;
  }

  public async deleteAll() {
    const { count } = await prisma.vivaQuestion.deleteMany();
    return count;
  }

  public async toggleLock(id: string) {
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id },
    });
    if (!vivaQuestion) {
      throw new Error('Viva question not found');
    }
    const updatedVivaQuestion = await prisma.vivaQuestion.update({
      where: { id },
      data: { locked: !vivaQuestion.locked },
    });
    return updatedVivaQuestion;
  }

  public async regenerate(id: string) {
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id },
    });

    if (!vivaQuestion) {
      throw new Error('Viva question not found');
    }

    await requestVivaQuestionRegeneration(id);
  }

  public async lockVivaQuestion(vivaQuestionId: string) {
    // Retrieve the viva question and its category
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id: vivaQuestionId },
      include: { submission: true },
    });

    if (!vivaQuestion) throw new Error('VivaQuestion not found');

    // Lock the question
    await prisma.vivaQuestion.update({
      where: { id: vivaQuestionId },
      data: { locked: true },
    });

    // Add category to submission's lockedCategories
    await prisma.submission.update({
      where: { id: vivaQuestion.submission.id },
      data: {
        lockedCategories: vivaQuestion.category
          ? {
              push: vivaQuestion.category,
            }
          : undefined,
      },
    });
  }

  public async unlockVivaQuestion(vivaQuestionId: string) {
    // Find the viva question with its submission and category
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id: vivaQuestionId },
      include: { submission: true },
    });

    if (!vivaQuestion) throw new Error('VivaQuestion not found');

    // Update the submission to remove the category from lockedCategories
    const { submission, category } = vivaQuestion;
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        lockedCategories: {
          set: submission.lockedCategories.filter((cat) => cat !== category),
        },
      },
    });

    // Update the VivaQuestion's locked status to false
    await prisma.vivaQuestion.update({
      where: { id: vivaQuestionId },
      data: { locked: false },
    });
  }

  public async update(id: string, question: string) {
    const vivaQuestion = await prisma.vivaQuestion.findUnique({
      where: { id },
    });

    if (!vivaQuestion) {
      throw new Error('Viva question not found');
    }

    const updatedVivaQuestion = await prisma.vivaQuestion.update({
      where: { id },
      data: {
        question,
        category: 'custom',
      },
    });

    return updatedVivaQuestion;
  }
}
