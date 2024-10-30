import prisma from '@/lib/prisma';

/**
 * Function to check if the user has read access to a unit.
 */
export const hasReadAccess = async (
  unitId: string,
  userId: string
): Promise<boolean> => {
  // Fetch the unit
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
  });

  if (!unit) {
    return false;
  }

  // Check if the user is the owner of the unit
  if (unit.ownerId === userId) {
    return true;
  }

  // Check if the user has been granted access to the unit
  const access = await prisma.unitAccess.findUnique({
    where: {
      userId_unitId: {
        userId,
        unitId,
      },
    },
  });

  if (
    access &&
    (access.role === 'READ_ONLY' || access.role === 'READ_WRITE') &&
    access.status === 'ACCEPTED'
  ) {
    return true;
  }

  return false;
};

/**
 * Function to check if the user has read/write access to a unit.
 */
export const hasReadWriteAccess = async (
  unitId: string,
  userId: string
): Promise<boolean> => {
  // Fetch the unit
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
  });

  if (!unit) {
    return false;
  }

  // Check if the user is the owner of the unit
  if (unit.ownerId === userId) {
    return true;
  }

  // Check if the user has been granted read/write access to the unit
  const access = await prisma.unitAccess.findUnique({
    where: {
      userId_unitId: {
        userId,
        unitId,
      },
    },
  });

  if (access && access.role === 'READ_WRITE' && access.status === 'ACCEPTED') {
    return true;
  }

  return false;
};
