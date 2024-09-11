import { type User } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class UserService {
  @LogMessage<[User]>({ message: 'test-decorator' })
  
  public async create(data: User) {
    const user = await prisma.user.create({ data });
    return user;
  }

  public async get(id: string){
    const user =  await prisma.user.findUnique({
      where: { id },
    });
      return user;
  }

  public async getAll() {
    const users = await prisma.user.findMany();
    return users;
  }

  public async delete(id: string){
    const user =  await prisma.user.delete({
      where: { id },
    });
      return user;
  }

  public async deleteAll(){
    const { count } = await prisma.user.deleteMany()
    return count
  }
}