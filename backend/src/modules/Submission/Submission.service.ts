import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import S3PDFHandler from '@/utils/s3-util';
import {
  requestVivaGeneration,
  requestSummaryAndQualityGeneration,
} from '@/services/ai-service/ai-service';
import { type SubmissionResponseDto } from '@/dto/submission.dto';
import DocxService from '@/services/docx.service';

export default class SubmissionService {
  private readonly docxService = new DocxService();

  private readonly s3Handler: S3PDFHandler;

  constructor() {
    this.s3Handler = new S3PDFHandler();
  }

  public async getSubmissionById(
    id: string
  ): Promise<SubmissionResponseDto | null> {
    try {
      const submission = await prisma.submission.findFirst({
        where: {
          id,
          deletedAt: null,
        },
        include: {
          assignment: {
            select: {
              name: true,
            },
          },
          vivaQuestions: {
            where: {
              deletedAt: null,
            },
            select: {
              id: true,
              question: true,
              status: true,
            },
          },
        },
      });

      if (!submission) {
        return null;
      }

      const submissionResponse: SubmissionResponseDto = {
        id: submission.id,
        assignmentId: submission.assignmentId,
        assignmentName: submission.assignment.name,
        studentId: submission.studentId ?? undefined,
        submissionFile: submission.submissionFile,
        status: submission.status,
        vivaStatus: submission.vivaStatus,
        studentCode: submission.studentCode ?? undefined,
        createdAt: submission.createdAt,
        qualityAssessment: submission.qualityAssessment ?? undefined,
        summary: submission.summary ?? undefined,
        vivaRequestDate: submission.vivaRequestDate ?? undefined,
        vivaQuestions: submission.vivaQuestions.map((q) => ({
          id: q.id,
          question: q.question,
          status: q.status,
        })),
      };

      return submissionResponse;
    } catch (error) {
      console.error('Error in getSubmissionById:', error);
      return null;
    }
  }

  public async getVivaQuestions(submissionId: string) {
    const vivaQuestions = await prisma.vivaQuestion.findMany({
      where: {
        submissionId,
        deletedAt: null, // Ensure only active records are fetched
      },
    });
    return vivaQuestions;
  }

  public async generateVivaQuestions(submissionId: string) {
    await requestVivaGeneration(submissionId);
  }

  public async getSummary(submissionId: string) {
    const summary = await prisma.submissionSummary.findFirst({
      where: {
        submissionId,
        deletedAt: null,
      },
    });
    return summary;
  }

  public async generateSummary(submissionId: string) {
    await requestSummaryAndQualityGeneration(submissionId);
  }

  public async delete(id: string) {
    const submission = await prisma.submission.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return submission;
  }

  public async deleteAll() {
    const { count } = await prisma.submission.updateMany({
      where: { deletedAt: null }, // Only update records that are not already deleted
      data: { deletedAt: new Date() },
    });
    return count;
  }

  public async getPDFById(id: string): Promise<Buffer | null> {
    try {
      // Fetch the submission from the database to get the S3 key
      const submission = await prisma.submission.findFirst({
        where: {
          id,
          deletedAt: null, // Ensure only active submissions are fetched
        },
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

  public async mapMultipleSubmissions(
    mappings: Array<{ studentId: string; submissionId: string }>
  ) {
    const results = await Promise.all(
      mappings.map(async ({ submissionId, studentId }) => {
        try {
          // Validate input data
          if (!studentId || !submissionId) {
            throw new Error('Both studentId and submissionId must be provided');
          }

          const updatedSubmission = await prisma.submission.update({
            where: {
              id: submissionId,
              deletedAt: null,
            },
            data: { studentCode: studentId },
          });

          return { success: true, submissionId, updatedSubmission };
        } catch (error) {
          // Handle Prisma-specific errors
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle "Record not found" error
            if (error.code === 'P2025') {
              return {
                success: false,
                submissionId,
                error: `Submission with ID ${submissionId} not found or has been soft-deleted`,
              };
            }
          }

          // General error handling
          return { success: false, submissionId, error: error.message };
        }
      })
    );

    // Separate successful and failed updates for better reporting
    const successfulUpdates = results.filter((result) => result.success);
    const failedUpdates = results.filter((result) => !result.success);

    if (failedUpdates.length > 0) {
      console.warn(`Some mappings failed: ${JSON.stringify(failedUpdates)}`);
    }

    return {
      successfulUpdates: successfulUpdates.map(
        (result) => result.updatedSubmission
      ),
      failedUpdates,
    };
  }

  public async regenerateUnlockedQuestions(submissionId: string) {
    // Retrieve locked categories for the submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { lockedCategories: true },
    });

    if (!submission) throw new Error('Submission not found');

    const { lockedCategories } = submission;

    // Delete only unlocked VivaQuestions
    await prisma.vivaQuestion.deleteMany({
      where: {
        submissionId,
        category: { notIn: lockedCategories },
      },
    });

    // Request AI service to regenerate questions for unlocked categories
    await requestVivaGeneration(submissionId);
  }

  public async getLockedStatus(submissionId: string) {
    // Retrieve locked categories for the submission
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      select: { lockedCategories: true },
    });

    if (!submission) throw new Error('Submission not found');

    // Get all VivaQuestions for the submission with their categories and locked status
    const vivaQuestions = await prisma.vivaQuestion.findMany({
      where: { submissionId },
      select: {
        category: true,
        locked: true,
      },
    });

    // Return each category's locked status based on whether it's in lockedCategories
    return vivaQuestions.map((question) => ({
      category: question.category,
      locked: question.category
        ? submission.lockedCategories.includes(question.category)
        : false,
    }));
  }

  public async addCustomQuestion(submissionId: string, questionText: string) {
    const customQuestion = await prisma.vivaQuestion.create({
      data: {
        id: uuidv4(),
        submissionId,
        question: questionText,
        category: 'custom',
        status: 'GENERATED',
        locked: true,
      },
    });

    return customQuestion;
  }

  public async generateVivaQuestionsDocx(
    submissionId: string
  ): Promise<Buffer> {
    const submission = await prisma.submission.findFirst({
      where: { id: submissionId, deletedAt: null },
      include: {
        vivaQuestions: {
          where: { deletedAt: null },
          select: { question: true, category: true },
        },
        student: { select: { name: true } },
      },
    });

    if (!submission) throw new Error('Submission not found');

    // Use DocxService to generate the DOCX buffer
    return await this.docxService.generateSingleSubmissionDocx(submission);
  }
}
