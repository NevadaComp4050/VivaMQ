/* eslint-disable unicorn/filename-case */
import { type Assignment, type Term } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getTermDisplayString } from '@/utils/term-name-util';

export default class UnitService {
  private async findOrCreateSession(term: Term, year: number) {
    let session = await prisma.session.findFirst({
      where: { term, year, deletedAt: null },
    });

    if (!session) {
      const termString = getTermDisplayString(term);
      session = await prisma.session.create({
        data: {
          displayName: `${termString}, ${year}`,
          term,
          year,
        },
      });
    }

    return session;
  }

  private determineAccessType(userId: string, unit: any): string {
    if (unit.ownerId === userId) return 'Owner';

    const userAccess = unit.accesses.find(
      (access) => access.userId === userId && access.status === 'ACCEPTED'
    );

    if (userAccess) {
      return userAccess.role === 'READ_ONLY' ? 'Read-Only' : 'Read-Write';
    }

    return 'None';
  }

  public async create(data: {
    name: string;
    term: Term;
    year: number;
    ownerId: string;
  }) {
    const session = await this.findOrCreateSession(data.term, data.year);

    return await prisma.unit.create({
      data: {
        name: data.name,
        ownerId: data.ownerId,
        sessionId: session.id,
      },
    });
  }

  public async getUnitsGroupedBySession(userId: string) {
    const sessions = await prisma.session.findMany({
      where: { deletedAt: null },
      include: {
        units: {
          where: {
            OR: [
              { ownerId: userId },
              { accesses: { some: { userId, status: 'ACCEPTED' } } },
            ],
            deletedAt: null,
          },
          include: { accesses: true },
        },
      },
    });

    const sortedSessions = sessions.sort((a, b) => {
      const termOrder = {
        SESSION_3: 0,
        SESSION_2: 1,
        SESSION_1: 2,
        ALL_YEAR: 3,
      };
      return b.year - a.year || termOrder[a.term] - termOrder[b.term];
    });

    return sortedSessions
      .filter((session) => session.units.length > 0)
      .map((session) => ({
        ...session,
        units: session.units.map((unit) => ({
          ...unit,
          accessType: this.determineAccessType(userId, unit),
        })),
      }));
  }

  public async getUnitWithDetails(userId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        OR: [
          { ownerId: userId },
          { accesses: { some: { userId, status: 'ACCEPTED' } } },
        ],
        deletedAt: null,
      },
      include: {
        assignments: {
          where: { deletedAt: null },
          include: {
            submissions: { where: { deletedAt: null } },
          },
        },
        tutors: { where: { deletedAt: null } },
      },
    });

    if (!unit)
      throw new Error(`Unit with ID ${unitId} not found or access denied.`);

    const assignmentsWithStatus = unit.assignments.map((assignment) => ({
      ...assignment,
      submissionStatuses: assignment.submissions.reduce<Record<string, number>>(
        (acc, submission) => {
          acc[submission.status] = (acc[submission.status] || 0) + 1;
          return acc;
        },
        {}
      ),
    }));

    const vivaQuestionCount = await prisma.vivaQuestion.count({
      where: {
        submission: { assignment: { unitId, deletedAt: null } },
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
    data: Partial<{ name: string; term: Term; year: number }>
  ) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    return await prisma.unit.update({
      where: { id: unitId },
      data: updateData,
    });
  }

  public async getUnits(userId: string, limit: number, offset: number) {
    const units = await prisma.unit.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { accesses: { some: { userId, status: 'ACCEPTED' } } },
        ],
        deletedAt: null,
      },
      include: { accesses: true },
      skip: offset,
      take: limit,
    });

    return units.map((unit) => ({
      ...unit,
      accessType: this.determineAccessType(userId, unit),
    }));
  }

  public async getUnit(userId: string, unitId: string) {
    const unit = await prisma.unit.findFirst({
      where: {
        id: unitId,
        OR: [
          { ownerId: userId },
          { accesses: { some: { userId, status: 'ACCEPTED' } } },
        ],
        deletedAt: null,
      },
      include: { accesses: true },
    });

    if (!unit)
      throw new Error(`Unit with ID ${unitId} not found or access denied.`);

    return {
      ...unit,
      accessType: this.determineAccessType(userId, unit),
    };
  }

  public async updateUnitName(id: string, name: string) {
    return await prisma.unit.update({ where: { id }, data: { name } });
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

  public async createAssignment(
    unitId: string,
    data: Omit<Assignment, 'id' | 'unitId'>
  ) {
    return await prisma.assignment.create({
      data: {
        ...data,
        unit: { connect: { id: unitId } },
      },
    });
  }

  public async getAssignments(unitId: string, limit: number, offset: number) {
    return await prisma.assignment.findMany({
      where: { unitId, deletedAt: null },
      skip: offset,
      take: limit,
    });
  }
}
