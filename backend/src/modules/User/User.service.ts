import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {
  @LogMessage<[User]>({ message: 'test-decorator' })
  
  public async create(data: User) {
    const user = await prisma.user.create({ data });
    return user;
  }

  public async get(id: string) {
    const ret = await prisma.user.findUnique({
      where: { id },
    });
    return ret;
  }

  public async getEmail(email: string) {
    const ret = await prisma.user.findUnique({
      where: { email },
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
