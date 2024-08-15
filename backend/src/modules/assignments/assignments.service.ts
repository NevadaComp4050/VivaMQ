import { Assignment } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class AssignmentService {
  @LogMessage<[Assignment]>({ message: 'Creating an assignment' })
  public async createAssignment(data: Assignment) {
    const assignment = await prisma.assignment.create({ data });
    return assignment;
  }

  //@LogMessage<[Assignment[]]>({ message: 'Getting all assignments' })
  public async getAssignments() {
    const assignments = await prisma.assignment.findMany();
    return assignments;
  }
}
