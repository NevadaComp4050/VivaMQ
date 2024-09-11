import { type Assignment } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class AssignmentService {
  @LogMessage<[Assignment]>({ message: 'test-decorator' })

  public async create(data: Assignment) {
    const assignment = await prisma.assignment.create({ data });
    return assignment;
  }

  public async get(id: string){
    const assignment =  await prisma.assignment.findUnique({
      where: { id },
    });
      return assignment;
  }

  public async getAll() {
    const assignments = await prisma.assignment.findMany();
    return assignments;
  }

  public async delete(id: string){
    const assignment =  await prisma.assignment.delete({
      where: { id },
    });
      return assignment;
  }

  public async deleteAll(){
    const { count } = await prisma.assignment.deleteMany()
    return count
  }
}