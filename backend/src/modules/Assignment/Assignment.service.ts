import { type Assignment,type Submission } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class AssignmentService {
  @LogMessage<[Assignment]>({ message: 'test-decorator' })

  public async createAssignment(data: Assignment) {
    const assignment = await prisma.assignment.create({ data });
    return assignment;
  }

  public async getAssignments() {
    const assignments = await prisma.assignment.findMany();
    return assignments;
  }

  public async deleteAssignments() {
    const { count } = await prisma.assignment.deleteMany();
    return count;
  }

  public async createSubmission(data: Submission) {
    const submission = await prisma.submission.create({ data });
    return submission;
  }

  public async getSubmissions(assignmentId: string, limit: number, offset: number) {
    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      skip: offset,
      take: limit,
    });
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

}
