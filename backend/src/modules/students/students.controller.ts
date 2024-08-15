import { NextFunction, Request } from 'express';
import { Student } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import StudentService from './students.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class StudentController extends Api {
  private readonly studentService = new StudentService();

  public createStudent = async (req: Request, res: CustomResponse<Student>, next: NextFunction) => {
    try {
      const student = await this.studentService.createStudent(req.body);
      this.send(res, student, HttpStatusCode.Created, 'createStudent');
    } catch (e) {
      next(e);
    }
  };

  public getAllStudents = async (req: Request, res: CustomResponse<Student[]>, next: NextFunction) => {
    try {
      const studentList = await this.studentService.getStudents();
      this.send(res, studentList, HttpStatusCode.Ok, 'gotAllStudents');
    } catch (e) {
      next(e);
    }
  };
}