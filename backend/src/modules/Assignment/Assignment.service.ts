import { type Assignment } from '@prisma/client';
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

  public async deleteAssignments(){
    const { count } = await prisma.assignment.deleteMany()
    return count
  }
}