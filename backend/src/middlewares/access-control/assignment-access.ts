import { type Response, type NextFunction } from 'express';
import { HttpStatusCode } from 'axios';
import prisma from '@/lib/prisma';
import { type ExtendedRequest } from '@/types/express';

/**
 * Middleware to verify if the user has read access to an assignment.
 */
export const VerifyAssignmentReadAccess = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = req.params;
    if (!req.user) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;

    // Fetch the assignment with the related unit
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { unit: true },
    });

    if (!assignment) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: 'Assignment not found' });
    }

    // Check if the user is the owner of the unit
    if (assignment.unit.ownerId === userId) {
      next();
      return;
    }

    // Check if the user has been granted access to the unit
    const access = await prisma.unitAccess.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId: assignment.unitId,
        },
      },
    });

    if (
      access &&
      (access.role === 'READ_ONLY' || access.role === 'READ_WRITE') &&
      access.status === 'ACCEPTED'
    ) {
      next();
      return;
    }

    // If no access was found or the access is insufficient
    return res
      .status(HttpStatusCode.Forbidden)
      .json({ error: 'Access denied to this assignment' });
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to verify if the user has read/write access to an assignment.
 */
export const VerifyAssignmentReadWriteAccess = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { assignmentId } = req.params;
    if (!req.user) {
      return res
        .status(HttpStatusCode.Unauthorized)
        .json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;

    // Fetch the assignment with the related unit
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { unit: true },
    });

    if (!assignment) {
      return res
        .status(HttpStatusCode.NotFound)
        .json({ error: 'Assignment not found' });
    }

    // Check if the user is the owner of the unit
    if (assignment.unit.ownerId === userId) {
      next();
      return;
    }

    // Check if the user has been granted read/write access to the unit
    const access = await prisma.unitAccess.findUnique({
      where: {
        userId_unitId: {
          userId,
          unitId: assignment.unitId,
        },
      },
    });

    if (
      access &&
      access.role === 'READ_WRITE' &&
      access.status === 'ACCEPTED'
    ) {
      next();
      return;
    }

    return res
      .status(HttpStatusCode.Forbidden)
      .json({ error: 'Write access denied to this assignment' });
  } catch (err) {
    next(err);
  }
};
