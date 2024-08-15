import { User } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {
  @LogMessage({ message: 'Creating a user' })
  public async createUser(data: User): Promise<User> {
    const user = await prisma.user.create({ data });
    return user;
  }

  //@LogMessage({ message: 'Getting all users' })
  public async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users;
  }
}
