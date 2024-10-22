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
        deletedAt: null,
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
      where: {
        deletedAt: null,
      },
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
            deletedAt: null, // Include only non-deleted units
          },
          include: {
            accesses: true,
          },
        },
      },
    });

    const sortedSessions = sessions.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      const termOrder = {
        SESSION_3: 0,
        SESSION_2: 1,
        SESSION_1: 2,
        ALL_YEAR: 3,
      };

      return termOrder[a.term] - termOrder[b.term];
    });

    const filteredSessions = sortedSessions.filter(
      (session) => session.units.length > 0
    );

    const result = filteredSessions.map((session) => ({
      ...session,
      units: session.units.map((unit) => {
        let accessType = 'Owner';

        if (unit.ownerId !== userId) {
          const userAccess = unit.accesses.find(
            (access) => access.userId === userId
          );

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

        const { accesses, ...unitWithoutAccesses } = unit;
        return {
          ...unitWithoutAccesses,
          accessType,
        };
      }),
    }));

    return result;
  }

  public async getUnitWithDetails(userId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
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
        deletedAt: null,
      },
      include: {
        assignments: {
          where: { deletedAt: null },
          include: {
            submissions: {
              where: { deletedAt: null }, // Include only non-deleted submissions
            },
          },
        },
        tutors: {
          where: { deletedAt: null },
        },
      },
    });

    if (!unit) {
      throw new Error(`Unit with ID ${unitId} not found or access denied.`);
    }

    const assignmentsWithStatus = unit.assignments.map((assignment) => {
      const submissionStatuses = assignment.submissions.reduce<
        Record<string, number>
      >((acc, submission) => {
        acc[submission.status] = (acc[submission.status] || 0) + 1;
        return acc;
      }, {});

      return {
        ...assignment,
        submissionStatuses,
      };
    });

    const vivaQuestionCount = await prisma.vivaQuestion.count({
      where: {
        submission: {
          assignment: {
            unitId,
            deletedAt: null,
          },
        },
      },
    });

    return {
      ...unit,
      assignments: assignmentsWithStatus,
      vivaQuestionCount,
    };
  }

  public async updateUnitDetails(
    unitId: string,
    data: { name?: string; term?: Term; year?: number }
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const updatedUnit = await prisma.unit.update({
      where: { id: unitId },
      data: updateData,
    });

    return updatedUnit;
  }

  public async getUnits(userId: string, limit: number, offset: number) {
    const units = await prisma.unit.findMany({
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
        deletedAt: null, // Only include non-deleted units
      },
      include: {
        accesses: true,
      },
      skip: offset,
      take: limit,
    });

    const result = units.map((unit) => {
      let accessType = 'Owner';

      if (unit.ownerId !== userId) {
        const userAccess = unit.accesses.find(
          (access) => access.userId === userId
        );

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

      const { accesses, ...unitWithoutAccesses } = unit;
      return {
        ...unitWithoutAccesses,
        accessType,
      };
    });

    return result;
  }

  public async getUnit(userId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
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
        deletedAt: null,
      },
      include: {
        accesses: true,
      },
    });

    if (!unit) {
      throw new Error(`Unit with ID ${unitId} not found or access denied.`);
    }

    let accessType = 'Owner';
    if (unit.ownerId !== userId) {
      const userAccess = unit.accesses.find(
        (access) => access.userId === userId
      );

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

    const { accesses, ...unitWithoutAccesses } = unit;
    return {
      ...unitWithoutAccesses,
      accessType,
    };
  }

  public async updateUnitName(id: string, name: string) {
    return await prisma.unit.update({
      where: { id },
      data: { name },
    });
  }

  public async delete(id: string) {
    return await prisma.unit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public async deleteAll() {
    const { count } = await prisma.unit.updateMany({
      where: { deletedAt: null },
      data: { deletedAt: new Date() },
    });
    return count;
  }

  public async createAssignment(unitId: string, data: Assignment) {
    return await prisma.assignment.create({
      data: {
        name: data.name,
        specs: data.specs,
        settings: data.settings,
        unit: {
          connect: {
            id: unitId,
          },
        },
      },
    });
  }

  public async getAssignments(unitId: string, limit: number, offset: number) {
    return await prisma.assignment.findMany({
      where: {
        unitId,
        deletedAt: null, // Only include non-deleted assignments
      },
      skip: offset,
      take: limit,
    });
  }
}
