import { type Rubric } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class RubricService {
  public async createRubric(data: {
    name: string;
    assignmentId: string;
    createdById: string;
    rubricFile: string;
  }): Promise<Rubric> {
    return await prisma.rubric.create({
      data: {
        name: data.name,
        assignmentId: data.assignmentId,
        createdById: data.createdById,
        rubricFile: data.rubricFile,
      },
    });
  }

  public async getRubrics(limit: number, offset: number): Promise<Rubric[]> {
    return await prisma.rubric.findMany({
      skip: offset,
      take: limit,
      where: { deletedAt: null },
    });
  }

  public async linkRubricToAssignment(
    rubricId: string,
    assignmentId: string
  ): Promise<Rubric> {
    return await prisma.rubric.update({
      where: { id: rubricId },
      data: { assignmentId },
    });
  }

  public async deleteRubric(rubricId: string): Promise<Rubric | null> {
    return await prisma.rubric.update({
      where: { id: rubricId },
      data: { deletedAt: new Date() },
    });
  }
}
