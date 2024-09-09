import { type Tutor } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class TutorService {
  @LogMessage<[Tutor]>({ message: 'test-decorator' })

  public async createTutor(data: Tutor) {
    const tutor = await prisma.tutor.create({ data });
    return tutor;
  }

  public async getTutors() {
    const tutors = await prisma.unit.findMany();
    return tutors;
  }

  public async deleteTutors(){
    const { count } = await prisma.tutor.deleteMany()
    return count
  }
}