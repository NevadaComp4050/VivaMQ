import { type NextFunction, type Request } from 'express';
import { type Student } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import StudentService from './Student.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class StudentController extends Api {
  private readonly studentService = new StudentService();

  public create = async (
    req: Request,
    res: CustomResponse<Student>,
    next: NextFunction
  ) => {
    try {
      const newStudent = await this.studentService.create(req.body);
      this.send(res, newStudent, HttpStatusCode.Created, 'createStudent');
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<Student>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const student = await this.studentService.get(id);
      this.send(res, student, HttpStatusCode.Ok, 'gotStudent:'+id )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<Student[]>,
    next: NextFunction
  ) => {
    try {
      const studentList = await this.studentService.getAll();
      this.send(res, studentList, HttpStatusCode.Ok, 'gotAllStudents');
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<Student>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const student = await this.studentService.delete(id);
      this.send(res, student, HttpStatusCode.Ok, 'deletedStudent' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Student[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.studentService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllStudents' )
    } catch (e) {
      next(e)
    }
  };
}