import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import argon2 from 'argon2';

export default class UserService {
  @LogMessage<[User]>({ message: 'test-decorator' })
  public async createUser(data: User) {
    
    const hashedPassword = await argon2.hash(data.password);

    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return user;
  }

  public async get(id: string) {
    const ret = await prisma.user.findUnique({
      where: { id },
    });
    return ret;
  }

  public async getAll() {
    const user = await prisma.user.findMany();
    return user;
  }

  public async delete(id: string) {
    const ret = await prisma.user.delete({
      where: { id },
    });
    return ret;
  }

  public async deleteAll() {
    const { count } = await prisma.user.deleteMany();
    return count;
  }
}
