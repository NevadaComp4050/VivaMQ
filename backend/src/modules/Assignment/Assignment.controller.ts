import { type NextFunction, type Request } from 'express';
import { type Assignment } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './Assignment.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class AssignmentController extends Api {
  private readonly assignmentService = new AssignmentService();

  public create = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const newAssignment = await this.assignmentService.create(req.body);
      this.send(res, newAssignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  public get = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.get(id);
      this.send(res, assignment, HttpStatusCode.Ok, 'gotAssignment:'+id )
    } catch (e) {
      next(e)
    }
  }

  public getAll = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const assignmentList = await this.assignmentService.getAll();
      this.send(res, assignmentList, HttpStatusCode.Ok, 'gotAllAssignments');
    } catch (e) {
      next(e);
    }
  };

  public delete = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const assignment = await this.assignmentService.delete(id);
      this.send(res, assignment, HttpStatusCode.Ok, 'deletedAssignment' )
    } catch (e) {
      next(e)
    }
  }

  public deleteAll = async (
    req: Request,
    res: CustomResponse<Assignment[]>,
    next: NextFunction
  ) => {
    try {
      const count = await this.assignmentService.deleteAll();
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllAssignments' )
    } catch (e) {
      next(e)
    }
  };
}