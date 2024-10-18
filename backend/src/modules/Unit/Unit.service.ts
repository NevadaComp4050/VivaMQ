import { type Assignment, type Term } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getTermDisplayString } from '@/utils/term-name-util';

export default class UnitService {
  public async create(data: {
    name: string;
    term: Term;
    year: number;
    ownerId: string;
  }) {
    console.log('create unit service', data);

    let session = await prisma.session.findFirst({
      where: {
        term: data.term,
        year: data.year,
      },
    });

    if (!session) {
      const termString = getTermDisplayString(data.term);
      session = await prisma.session.create({
        data: {
          displayName: `${termString}, ${data.year}`,
          term: data.term,
          year: data.year,
        },
      });
    }

    const unit = await prisma.unit.create({
      data: {
        name: data.name,
        ownerId: data.ownerId,
        sessionId: session.id,
      },
    });

    return unit;
  }

  public async getUnitsGroupedBySession(userId: string) {
    return await prisma.session.findMany({
      include: {
        units: {
          where: {
            OR: [
              { ownerId: userId },
              {
                accesses: {
                  some: {
                    userId,
                    status: 'ACCEPTED',
                  },
                },
              },
            ],
          },
        },
      },
    });
  }

  public async getUnits(userId: string, limit: number, offset: number) {
    return await prisma.unit.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            accesses: {
              some: {
                userId,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
      skip: offset,
      take: limit,
    });
  }

  public async getUnit(userId: string, unitId: string) {
    return await prisma.unit.findFirst({
      where: {
        id: unitId,
        OR: [
          { ownerId: userId },
          {
            accesses: {
              some: {
                userId,
                status: 'ACCEPTED',
              },
            },
          },
        ],
      },
    });
  }

  public async updateUnitName(id: string, name: string) {
    return await prisma.unit.update({
      where: { id },
      data: { name },
    });
  }

  public async delete(id: string) {
    return await prisma.unit.delete({
      where: { id },
    });
  }

  public async deleteAll() {
    const { count } = await prisma.unit.deleteMany();
    return count;
  }

  public async createAssignment(unitId: string, data: Assignment) {
    return await prisma.assignment.create({
      data: {
        ...data,
        unitId,
      },
    });
  }

  public async getAssignments(unitId: string, limit: number, offset: number) {
    return await prisma.assignment.findMany({
      where: { unitId },
      skip: offset,
      take: limit,
    });
  }
}
