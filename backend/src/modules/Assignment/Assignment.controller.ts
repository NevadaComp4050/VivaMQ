import { type NextFunction, type Request } from 'express';
import { type Assignment } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './Assignment.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class AssignmentController extends Api {
  private readonly assignmentService = new AssignmentService();

  public createAssignment = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const newAssignment = await this.assignmentService.createAssignment(req.body);
      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  public getallassignments = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const assignmentList = await this.assignmentService.getAssignments();
      this.send(res, assignmentList, HttpStatusCode.Ok, 'gotAllAssignments');
    } catch (e) {
      next(e);
    }
  };

  public deleteallassignments = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.assignmentService.deleteAssignments();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllAssignments' )
    } catch (e) {
      next(e)
    }
  };
}