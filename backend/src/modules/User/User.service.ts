import { type User } from '@prisma/client';
import argon2 from 'argon2';
import prisma from '@/lib/prisma';
export default class UserService {
  public async createUser(data: Omit<User, 'id'>) {
    const hashedPassword = await argon2.hash(data.password);

    console.log(data);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role,
      },
    });
    return user;
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
