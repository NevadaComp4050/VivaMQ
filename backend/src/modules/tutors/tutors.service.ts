import { Tutor } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class TutorService {
  @LogMessage<[Tutor]>({ message: 'Creating a tutor' })
  public async createTutor(data: Tutor) {
    const tutor = await prisma.tutor.create({ data });
    return tutor;
  }

  //@LogMessage<[Tutor[]]>({ message: 'Getting all tutors' })
  public async getTutors() {
    const tutors = await prisma.tutor.findMany();
    return tutors;
  }
}