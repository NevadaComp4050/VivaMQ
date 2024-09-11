import { type Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class StudentService {
  @LogMessage<[Student]>({ message: 'test-decorator' })

  public async create(data: Student) {
    const student = await prisma.student.create({ data });
    return student;
  }

  public async get(id: string){
    const student =  await prisma.student.findUnique({
      where: { id },
    });
      return student;
  }

  public async getAll() {
    const students = await prisma.student.findMany();
    return students;
  }

  public async delete(id: string){
    const student =  await prisma.student.delete({
      where: { id },
    });
      return student;
  }

  public async deleteAll(){
    const { count } = await prisma.student.deleteMany()
    return count
  }
}