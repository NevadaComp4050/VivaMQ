import prisma from '@/lib/prisma';
import { queueVivaGeneration } from '@/services/viva-service';
import S3PDFHandler from '@/utils/s3-util';

export default class SubmissionService {
  private readonly s3Handler: S3PDFHandler;

  constructor() {
    this.s3Handler = new S3PDFHandler();
  }

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

  public async getPDFById(id: string): Promise<Buffer | null> {
    try {
      // Fetch the submission from the database to get the S3 key
      const submission = await prisma.submission.findUnique({
        where: { id },
        select: { submissionFile: true },
      });

      if (!submission?.submissionFile) {
        console.error('Submission not found or missing S3 key');
        return null;
      }

      // Fetch the PDF from S3 using the S3PDFHandler
      const pdfData = await this.s3Handler.fetchPDF(submission.submissionFile);
      return pdfData;
    } catch (error) {
      console.error('Error in getPDFById:', error);
      return null;
    }
  }
}
