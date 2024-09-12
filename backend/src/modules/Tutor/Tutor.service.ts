import { type Tutor } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class TutorService {
  @LogMessage<[Tutor]>({ message: 'test-decorator' })

  public async create(data: Tutor) {
    const tutor = await prisma.tutor.create({ data });
    return tutor;
  }

  public async get(id: string){
    const tutor =  await prisma.tutor.findUnique({
      where: { id },
    });
      return tutor;
  }

  public async getAll() {
    const tutors = await prisma.tutor.findMany();
    return tutors;
  }

  public async delete(id: string){
    const tutor =  await prisma.tutor.delete({
      where: { id },
    });
      return tutor;
  }

  public async deleteAll(){
    const { count } = await prisma.tutor.deleteMany()
    return count
  }
}