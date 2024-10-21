import prisma from '@/lib/prisma';
import { queueVivaGeneration } from '@/services/viva-service';

export default class SubmissionService {
  public async getVivaQuestions(submissionId: string) {
    const vivaQuestions = await prisma.vivaQuestion.findMany({
      where: { submissionId },
    });
    return vivaQuestions;
  }

  public async generateVivaQuestions(submissionId: string) {
    await queueVivaGeneration(submissionId);
  }

  public async delete(id: string) {
    const submission = await prisma.submission.delete({
      where: { id },
    });
    return submission;
  }

  public async deleteAll() {
    const { count } = await prisma.submission.deleteMany();
    return count;
  }
}
