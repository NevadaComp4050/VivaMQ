import { type Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class StudentService {
  @LogMessage<[Student]>({ message: 'test-decorator' })

  public async createStudent(data: Student) {
    const student = await prisma.student.create({ data });
    return student;
  }

  public async getStudents() {
    const students = await prisma.student.findMany();
    return students;
  }

  public async deleteStudents(){
    const { count } = await prisma.student.deleteMany()
    return count
  }
}