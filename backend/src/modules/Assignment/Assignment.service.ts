import { Prisma, type Assignment } from '@prisma/client';
import JSZip from 'jszip';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import S3PDFHandler from '@/utils/s3-util';
import {
  requestVivaGeneration,
  requestSummaryAndQualityGeneration,
} from '@/services/ai-service/ai-service';
export default class AssignmentService {
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
      throw new Error('Assignment with id ' + data.assignmentId + ' not found');
    }

    const s3Key = `submissions/${data.assignmentId}/${Date.now()}.pdf`;

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

    for (const submission of submissions) {
      await requestVivaGeneration(submission.id);
    }

    return {
      message:
        'Viva generation process started for submissions of count: ' +
        String(submissions.length),
    };
  }

  public async generateSummaries(assignmentId: string) {
    const submissions = await prisma.submission.findMany({
      where: {
        assignmentId,
        deletedAt: null,
      },
    });

    for (const submission of submissions) {
      await requestSummaryAndQualityGeneration(submission.id);
    }

    return {
      message:
        'Summary generation process started for submissions of count: ' +
        String(submissions.length),
    };
  }

  public async generateVivaQuestionsZip(
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
      },
      include: {
        vivaQuestions: true,
        student: true,
        ...studentFilter,
      },
    });

    if (submissions.length === 0) {
      throw new Error('No viva questions found');
    } else {
      console.log('Submissions:', submissions.length);
    }

    const zip = new JSZip();

    // Combined document sections
    const combinedSections: any[] = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Combined Viva Questions',
            bold: true,
            size: 32,
          }),
        ],
      }),
      new Paragraph({
        text: 'This document contains viva questions grouped by student.',
        spacing: { after: 300 },
      }),
    ];

    // Generate DOCX for each student and add to combined document
    for (const submission of submissions) {
      const studentName = submission.student?.id ?? generateRandomId();
      const studentHeader = `Viva Questions for ${studentName}`;

      console.log(
        'Generating viva questions for:',
        studentName,
        submission.vivaQuestions.length
      );

      const studentSections: any[] = [
        new Paragraph({
          children: [
            new TextRun({
              text: studentHeader,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          text: 'Below are the viva questions for this student.',
          spacing: { after: 300 },
          style: 'Arial',
        }),
      ];

      combinedSections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: studentHeader,
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          text: 'Below are the viva questions for this student.',
          spacing: { after: 300 },
          style: 'Arial',
        })
      );

      let questionNumber = 1;
      for (const viva of submission.vivaQuestions) {
        const questionCategory = viva.category ?? 'General';
        const questionText = JSON.stringify(viva.question);

        const questionParagraph = new Paragraph({
          children: [
            new TextRun({
              text: `Category: ${questionCategory} - Question ${questionNumber}`,
              bold: true,
              size: 24,
              font: 'Arial',
            }),
            new TextRun({
              text: `\n${questionText}`,
              break: 1,
              font: 'Arial',
            }),
          ],
          spacing: { after: 200 },
        });

        studentSections.push(questionParagraph);
        combinedSections.push(questionParagraph);
        questionNumber++;
      }

      // Generate individual DOCX for student
      const studentDoc = new Document({
        sections: [{ children: studentSections }],
      });
      const studentBuffer = await Packer.toBuffer(studentDoc);
      zip.file(
        `viva_questions_${studentName}.docx`,
        new Uint8Array(studentBuffer)
      );
    }

    // Generate combined DOCX
    const combinedDoc = new Document({
      sections: [{ children: combinedSections }],
    });
    const combinedBuffer = await Packer.toBuffer(combinedDoc);
    zip.file('combined_viva_questions.docx', new Uint8Array(combinedBuffer));

    // Generate and return ZIP buffer
    return await zip.generateAsync({ type: 'nodebuffer' });
  }
}

function generateRandomId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
