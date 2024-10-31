/* eslint-disable unicorn/filename-case */
import { type Assignment, type Term, type AccessRole } from '@prisma/client';
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

  public async createAssignment(unitId: string, data: Assignment) {
    const createdAssignment = await prisma.assignment.create({
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
      include: {
        submissions: {
          where: { deletedAt: null },
        },
      },
    });

    const submissionStatuses = createdAssignment.submissions.reduce<
      Record<string, number>
    >((acc, submission) => {
      acc[submission.status] = (acc[submission.status] || 0) + 1;
      return acc;
    }, {});

    return {
      ...createdAssignment,
      submissionStatuses,
    };
  }

  public async getAssignments(unitId: string, limit: number, offset: number) {
    return await prisma.assignment.findMany({
      where: { unitId, deletedAt: null },
      skip: offset,
      take: limit,
    });
  }

  public async shareUnitWithUser(
    ownerId: string,
    unitId: string,
    email: string,
    role: AccessRole
  ) {
    // Check if the unit exists and belongs to the owner
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, ownerId, deletedAt: null },
    });

    if (!unit) {
      throw new Error('Unit not found or access denied');
    }

    // Find the user by email
    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if access already exists
    const existingAccess = await prisma.unitAccess.findFirst({
      where: {
        unitId,
        userId: user.id,
        deletedAt: null,
      },
    });

    if (existingAccess) {
      throw new Error('Unit already shared with this user');
    }

    // Create unit access (automatically accepted for now)
    const access = await prisma.unitAccess.create({
      data: {
        unitId,
        userId: user.id,
        role,
        status: 'ACCEPTED',
      },
    });

    // TODO: Send notification or email if needed

    return {
      message: 'Unit shared successfully',
      access,
    };
  }

  // Get list of users with access to the unit
  public async getUnitSharers(ownerId: string, unitId: string) {
    // Check if the unit exists and belongs to the owner
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, ownerId, deletedAt: null },
    });

    if (!unit) {
      throw new Error('Unit not found or access denied');
    }

    // Get list of users with access
    const accesses = await prisma.unitAccess.findMany({
      where: { unitId, deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return accesses;
  }

  // Remove a user's access to the unit
  public async removeUnitShare(
    ownerId: string,
    unitId: string,
    userId: string
  ) {
    // Check if the unit exists and belongs to the owner
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, ownerId, deletedAt: null },
    });

    if (!unit) {
      throw new Error('Unit not found or access denied');
    }

    // Check if the access exists
    const access = await prisma.unitAccess.findFirst({
      where: { unitId, userId, deletedAt: null },
    });

    if (!access) {
      throw new Error('Access not found');
    }

    // Soft delete the access
    await prisma.unitAccess.update({
      where: { id: access.id },
      data: { deletedAt: new Date() },
    });

    return {
      message: 'Access revoked successfully',
    };
  }
}
