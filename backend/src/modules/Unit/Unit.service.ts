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
    const sessions = await prisma.session.findMany({
      include: {
        units: {
          where: {
            OR: [
              { ownerId: userId }, // User is the owner
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
          include: {
            accesses: true, // Include access information
          },
        },
      },
    });

    // Process units to determine access type
    const result = sessions.map((session) => ({
      ...session,
      units: session.units.map((unit) => {
        let accessType = 'Owner'; // Default to Owner if the user is the owner

        // If the user is not the owner, check the accesses relation
        if (unit.ownerId !== userId) {
          const userAccess = unit.accesses.find(
            (access) => access.userId === userId
          );

          // If the user has access through UnitAccess, determine the access role
          if (userAccess) {
            if (userAccess.role === 'READ_ONLY') {
              accessType = 'Read-Only';
            } else if (userAccess.role === 'READ_WRITE') {
              accessType = 'Read-Write';
            }
          } else {
            accessType = 'None';
          }
        }

        // Return the unit with the additional accessType field, excluding accesses
        const { accesses, ...unitWithoutAccesses } = unit;
        return {
          ...unitWithoutAccesses,
          accessType,
        };
      }),
    }));

    return result;
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
