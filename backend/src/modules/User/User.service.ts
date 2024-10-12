import { type User, Role } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';
import argon2 from 'argon2';

export default class UserService {
  
  @LogMessage<[User]>({ message: 'test-decorator' })
  public async create(data: User) {
    const hashedPassword = await argon2.hash(data.password);

    const user = await prisma.user.create({ 
      data // Changes below need to be integrated properly
      /*
      data: {
        ...data,
        password: hashedPassword,
      },
      */
    });
    return user;
  }

  public async get(id: string) {
    const ret = await prisma.user.findUnique({
      where: { id },
    });
    return ret;
  }

  public async getEmail(email: string){
    const ret =  await prisma.user.findUnique({
      where: { email },
    });
      return ret;
  }

  // TODO log the calls
  //@LogMessage<[users]>({message: 'get all'})
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
  // Removed getEmail from here, other func returned a variable called user

  // TODO why is this here?
  public async dummyLogin() {
    let user = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });

    if (!user) {
      
      //TODO Purpose of User.service is to require service calls
      //const hashedPassword = await argon2.hash("password123");
      const hashedPassword = "password123";
      
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


  // TODO this needs explanation
  public async getCurrentUser() {
    const user = await prisma.user.findFirst({
      where: { email: "test@example.com" },
    });
    
    return user;
  }
}