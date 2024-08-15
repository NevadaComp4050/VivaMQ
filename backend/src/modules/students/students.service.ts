import { Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import LogMessage from '@/decorators/log-message.decorator';

export default class StudentService {
  @LogMessage<[Student]>({ message: 'Creating a student' })
  public async createStudent(data: Student) {
    const student = await prisma.student.create({ data });
    return student;
  }

  //@LogMessage<[Student[]]>({ message: 'Getting all students' })
  public async getStudents() {
    const students = await prisma.student.findMany();
    return students;
  }
}