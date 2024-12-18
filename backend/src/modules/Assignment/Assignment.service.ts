import { Prisma, type Assignment } from '@prisma/client';

import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import S3PDFHandler from '@/utils/s3-util';
import { requestVivaGeneration } from '@/services/ai-service/ai-service';
import DocxService from '@/services/docx.service';
export default class AssignmentService {
  private readonly docxService = new DocxService();
  private readonly s3Handler = new S3PDFHandler();

  @LogMessage<[Assignment]>({ message: 'test-decorator' })
  public async create(data: Assignment) {
    const assignment = await prisma.assignment.create({ data });
    return assignment;
  }

  public async get(id: string, userId: string) {
    // Find the assignment, including unit and accesses
    const assignment = await prisma.assignment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        unit: {
          include: {
            accesses: true,
          },
        },
      },
    });

    if (!assignment) {
      throw new Error(`Assignment with ID ${id} not found or access denied.`);
    }

    // Determine if the user has write access
    let writeable = false;

    // Check if the user is the unit owner
    if (assignment.unit.ownerId === userId) {
      writeable = true;
    } else {
      // Check if the user has READ_WRITE access to the unit
      const userAccess = assignment.unit.accesses.find(
        (access) => access.userId === userId && access.role === 'READ_WRITE'
      );
      if (userAccess) {
        writeable = true;
      }
    }

    // Return assignment details along with writeable status
    return {
      ...assignment,
      writeable,
    };
  }

  public async getAll() {
    const assignments = await prisma.assignment.findMany({
      where: {
        deletedAt: null,
      },
    });
    return assignments;
  }

  public async delete(id: string) {
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return assignment;
  }

  public async deleteAll() {
    const { count } = await prisma.assignment.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return count;
  }

  public async getAssignmentWithSubmissions(
    assignmentId: string,
    userId: string
  ) {
    // Fetch assignment and related submissions
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        deletedAt: null,
      },
      include: {
        submissions: {
          where: { deletedAt: null },
        },
        unit: {
          include: {
            accesses: true,
          },
        },
      },
    });

    if (!assignment) {
      return null;
    }

    // Determine if the user has write access
    let writeable = false;
    if (assignment.unit.ownerId === userId) {
      writeable = true;
    } else {
      const userAccess = assignment.unit.accesses.find(
        (access) => access.userId === userId && access.role === 'READ_WRITE'
      );
      if (userAccess) {
        writeable = true;
      }
    }

    return {
      ...assignment,
      writeable,
    };
  }

  public async createSubmission(data: {
    assignmentId: string;
    fileBuffer: Buffer;
    originalFileName: string; // Include original file name in data
  }) {
    if (!data.assignmentId) {
      throw new Error('Assignment ID must be provided');
    }

    const assignment = await prisma.assignment.findFirst({
      where: {
        id: data.assignmentId,
        deletedAt: null,
      },
    });

    if (!assignment) {
      throw new Error(`Assignment with id ${data.assignmentId} not found`);
    }

    const sanitizedFileName = data.originalFileName
      .replace(/[^a-z0-9.]/gi, '_')
      .toLowerCase();
    const s3Key = `submissions/${data.assignmentId}/${sanitizedFileName}`;

    await this.s3Handler.uploadPDFWithText(data.fileBuffer, s3Key);

    const submission = await prisma.submission.create({
      data: {
        assignmentId: data.assignmentId,
        submissionFile: s3Key,
        status: 'PENDING',
      },
    });

    return submission;
  }

  public async getSubmissions(
    assignmentId: string,
    limit: number,
    offset: number
  ) {
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        deletedAt: null,
      },
      skip: offset,
      take: limit,
    });

    console.log(submissions);

    return submissions;
  }

  public async mapStudentToSubmission(submissionId: string, studentId: string) {
    const submission = await prisma.submission.update({
      where: {
        id: submissionId,
        deletedAt: null,
      },
      data: { studentId },
    });
    return submission;
  }

  public async mapMultipleSubmissions(
    mappings: Array<{ studentId: string; submissionId: string }>
  ) {
    const results = await Promise.all(
      mappings.map(async ({ submissionId, studentId }) => {
        try {
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
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
              return {
                success: false,
                submissionId,
                error: `Submission with ID ${submissionId} not found or has been soft-deleted`,
              };
            }
          }

          return { success: false, submissionId, error: error.message };
        }
      })
    );

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

  public async getStudentSubmissionMapping(assignmentId: string) {
    const mappings = await prisma.submission.findMany({
      where: {
        assignmentId,
        deletedAt: null,
      },
      include: { student: true },
    });

    const mappingResult = mappings.map((submission) => ({
      submissionId: submission.id,
      studentId: submission.studentId,
      studentName: submission.student?.name,
    }));

    return mappingResult;
  }

  public async generateVivaQuestions(assignmentId: string) {
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        deletedAt: null,
      },
    });

    console.log(
      'Viva generation process started for submissions of count: ' +
        String(submissions.length)
    );

    const vivaGenerationTasks = submissions.map(async (submission, index) => {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await requestVivaGeneration(submission.id);
          resolve();
        }, index * 1000);
      });
    });

    await Promise.all(vivaGenerationTasks);

    return {
      message:
        'Viva generation process started for submissions of count: ' +
        String(submissions.length),
    };
  }

  public async generateCombinedVivaQuestionsZip(
    assignmentId: string,
    studentIds: string[]
  ): Promise<Buffer> {
    const studentFilter =
      studentIds && studentIds.length > 0
        ? { studentId: { in: studentIds } }
        : {};

    // Fetch submissions and viva questions for the given assignment (with or without student filter)
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        deletedAt: null,
        ...studentFilter,
      },
      include: {
        vivaQuestions: true,
        student: true,
      },
    });

    if (submissions.length === 0) {
      throw new Error('No viva questions found for the specified criteria.');
    }

    // Use DocxService to generate the ZIP buffer containing all DOCX files
    return await this.docxService.generateVivaQuestionsZip(submissions);
  }
}
