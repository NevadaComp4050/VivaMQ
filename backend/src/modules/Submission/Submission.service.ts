import prisma from '@/lib/prisma';
import { type VivaQuestion } from '@prisma/client';
import LogMessage from '@/decorators/log-message.decorator';
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
}
