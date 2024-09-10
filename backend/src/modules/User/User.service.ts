import { type User, Role } from '@prisma/client';
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


  public async dummyLogin() {
    let user = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });

    if (!user) {
      
      const hashedPassword = await argon2.hash("password123");
      user = await prisma.user.create({
        data: {
          email: "test@example.com",
          name: "Test User",
          password: hashedPassword,
          role: Role.ADMIN,
        },
      });
    }

    return user;
  }

  public async getEmail(email: string) {

    const user = await prisma.user.findFirst({
      where: { email },
    });
    return user;
  }

  public async getCurrentUser() {
    const user = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });
    
    return user;
  }
}
