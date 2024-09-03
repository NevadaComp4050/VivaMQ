import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {

  @LogMessage<[User]>({ message: 'test-decorator' })
  public async createUser(data: User) {
    const user = await prisma.user.create({ data });
    return user;
  }

  // TODO log the calls
  //@LogMessage<[users]>({message: 'get all'})
  public async getUsers() {
    const user = await prisma.user.findMany()
    return user;
  }

  public async deleteUsers(){
    const { count } = await prisma.user.deleteMany()
    return count
  }
}