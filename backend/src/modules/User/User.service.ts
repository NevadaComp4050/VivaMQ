import { type User, Role } from '@prisma/client';
import argon2 from 'argon2';
import prisma from '@/lib/prisma';

export default class UserService {
  public async createUser(data: Omit<User, 'id'>) {
    try {
      if (!Object.values(Role).includes(data.role)) {
        throw new Error(
          `Invalid role: ${data.role}. Expected one of: ${Object.values(Role).join(', ')}`
        );
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error(`Email ${data.email} is already in use.`);
      }

      const hashedPassword = await argon2.hash(data.password);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
          role: data.role,
        },
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  public async validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    return null;
  }

  public async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  public async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
