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

  // Updated method to get units grouped by session, sorted by year and term
  public async getUnitsGroupedBySession(userId: string) {
    const sessions = await prisma.session.findMany({
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
          include: {
            accesses: true,
          },
        },
      },
    });

    // Custom sorting function for sessions by year and term
    const sortedSessions = sessions.sort((a, b) => {
      // Sort by year in descending order
      if (a.year !== b.year) {
        return b.year - a.year;
      }

      // Sort by term in custom order: SESSION_3 > SESSION_2 > SESSION_1 > ALL_YEAR
      const termOrder = {
        SESSION_3: 0,
        SESSION_2: 1,
        SESSION_1: 2,
        ALL_YEAR: 3,
      };

      return termOrder[a.term] - termOrder[b.term];
    });

    // Process units to determine access type
    const result = sortedSessions.map((session) => ({
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

  public async updateUnitDetails(
    unitId: string,
    data: { name?: string; term?: Term; year?: number }
  ) {
    // Remove undefined properties from the update object
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
      },
      include: {
        accesses: true, // Include access information
      },
      skip: offset,
      take: limit,
    });

    // Process units to determine access type
    const result = units.map((unit) => {
      let accessType = 'Owner'; // Default to Owner if the user is the owner

      // If the user is not the owner, check the accesses relation
      if (unit.ownerId !== userId) {
        const userAccess = unit.accesses.find(
          (access) => access.userId === userId
        );

        // Determine access role
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

      // Return the unit with additional accessType field
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
      },
      include: {
        accesses: true, // Include access information
      },
    });

    if (!unit) {
      throw new Error(`Unit with ID ${unitId} not found or access denied.`);
    }

    // Determine access type
    let accessType = 'Owner'; // Default to Owner if the user is the owner
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

    // Return the unit with additional accessType field
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
