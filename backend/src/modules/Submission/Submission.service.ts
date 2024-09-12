import { type Submission } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class SubmissionService {
  @LogMessage<[Submission]>({ message: 'test-decorator' })

  public async createSubmission(data: Submission) {
    const submission = await prisma.submission.create({ data });
    return submission;
  }

  public async getSubmissions() {
    const submissions = await prisma.submission.findMany();
    return submissions;
  }

  public async deleteSubmissions(){
    const { count } = await prisma.submission.deleteMany()
    return count
  }
}