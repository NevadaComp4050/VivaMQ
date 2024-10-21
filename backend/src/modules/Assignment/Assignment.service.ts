import { Prisma, type Assignment } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import S3PDFHandler from '@/utils/s3-util';
import { submitSubmission } from '@/services/viva-service';
export default class AssignmentService {
  private readonly s3Handler = new S3PDFHandler();

  @LogMessage<[Assignment]>({ message: 'test-decorator' })
  public async create(data: Assignment) {
    const assignment = await prisma.assignment.create({ data });
    return assignment;
  }

  public async get(id: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
    });
    return assignment;
  }

  public async getAll() {
    const assignments = await prisma.assignment.findMany();
    return assignments;
  }

  public async delete(id: string) {
    const assignment = await prisma.assignment.delete({
      where: { id },
    });
    return assignment;
  }

  public async deleteAll() {
    const { count } = await prisma.assignment.deleteMany();
    return count;
  }

  public async getAssignmentWithSubmissions(id: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: true,
      },
    });
    return assignment;
  }

  public async createSubmission(data: {
    assignmentId: string;
    fileBuffer: Buffer;
  }) {
    if (!data.assignmentId) {
      throw new Error('Assignment ID must be provided');
    }

    const assignment = await prisma.assignment.findUnique({
      where: { id: data.assignmentId },
    });

    if (!assignment) {
      throw new Error('Assignmen with id ' + data.assignmentId + ' not found');
    }

    // Generate a unique key for S3 using the assignment ID and timestamp
    const s3Key = `submissions/${data.assignmentId}/${Date.now()}.pdf`;

    // Upload the PDF to S3 and also store the extracted text
    await this.s3Handler.uploadPDFWithText(data.fileBuffer, s3Key);

    // Once uploaded, store the S3 path in the database using the assignmentId
    const submission = await prisma.submission.create({
      data: {
        assignmentId: data.assignmentId,
        submissionFile: s3Key,
        status: 'PENDING', // Status to indicate it's awaiting further processing
      },
    });

    return submission;
  }

  public async getSubmissions(
    assignmentId: string,
    limit: number,
    offset: number
  ) {
    const whereClause = { assignmentId };

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
    });

    console.log(submissions);

    return submissions;
  }

  public async mapStudentToSubmission(submissionId: string, studentId: string) {
    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: { studentId },
    });
    return submission;
  }

  public async getStudentSubmissionMapping(assignmentId: string) {
    const mappings = await prisma.submission.findMany({
      where: { assignmentId },
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
    // Fetch all submissions for the assignment
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
    });

    // For each, trigger the viva question generation process
    for (const submission of submissions) {
      await submitSubmission(submission.id);
    }

    return {
      message:
        'Viva generation process started for submisisons of count: ' +
        String(submissions.length),
    };
  }
}
