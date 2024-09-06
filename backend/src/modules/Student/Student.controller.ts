import { type NextFunction, type Request } from 'express';
import { type Student } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import StudentService from './Student.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class StudentController extends Api {
  private readonly studentService = new StudentService();

  public createStudent = async (
    req: Request,
    res: CustomResponse<Student>,
    next: NextFunction
  ) => {
    try {
      const newStudent = await this.studentService.createStudent(req.body);
      this.send(res, newStudent, HttpStatusCode.Created, 'createStudent');
    } catch (e) {
      next(e);
    }
  };

  public getallstudents = async (
    req: Request,
    res: CustomResponse<Student[]>,
    next: NextFunction
  ) => {
    try {
      const studentList = await this.studentService.getStudents();
      this.send(res, studentList, HttpStatusCode.Ok, 'gotAllStudents');
    } catch (e) {
      next(e);
    }
  };

  public deleteallstudents = async (
    req: Request,
    res: CustomResponse<Student[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.studentService.deleteStudents();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllStudents' )
    } catch (e) {
      next(e)
    }
  };
}