import { type Rubric } from '@prisma/client';
import prisma from '@/lib/prisma';

export default class RubricService {
  public async createRubric(data: {
    title: string;
    assignmentId: string;
    createdById: string;
    rubricData: any;
  }): Promise<Rubric> {
    return await prisma.rubric.create({
      data: {
        title: data.title,
        assignmentId: data.assignmentId,
        createdById: data.createdById,
        rubricData: data.rubricData,
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

  public async getRubricById(id: string): Promise<Rubric | null> {
    return await prisma.rubric.findUnique({
      where: { id, deletedAt: null },
    });
  }

  public async updateRubric(
    id: string,
    data: { title?: string; rubricData?: any }
  ): Promise<Rubric | null> {
    return await prisma.rubric.update({
      where: { id, deletedAt: null },
      data: {
        title: data.title,
        rubricData: data.rubricData,
      },
    });
  }

  public async deleteRubric(id: string): Promise<Rubric | null> {
    return await prisma.rubric.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
