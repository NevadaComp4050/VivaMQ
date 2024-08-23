import prisma from '@/lib/prisma';
import { Request } from 'express';

export const getLoggedInUser = async (req: Request) => {
  if (!req.user) {
    throw new Error('Not authenticated');
  }

  const userId = (req.user as { userId: string }).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};