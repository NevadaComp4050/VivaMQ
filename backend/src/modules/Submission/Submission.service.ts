import { type Submission } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class SubmissionService {
  @LogMessage<[Submission]>({ message: 'test-decorator' })

  public async create(data: Submission) {
    const submission = await prisma.submission.create({ data });
    return submission;
  }

  public async get(id: string){
    const submission =  await prisma.submission.findUnique({
      where: { id },
    });
      return submission;
  }

  public async getAll() {
    const submissions = await prisma.submission.findMany();
    return submissions;
  }

  public async delete(id: string){
    const submission =  await prisma.submission.delete({
      where: { id },
    });
      return submission;
  }

  public async deleteAll(){
    const { count } = await prisma.submission.deleteMany()
    return count
  }
}