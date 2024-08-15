import { NextFunction, Request } from 'express';
import { Assignment } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './assignments.service';
import { CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';

export default class AssignmentController extends Api {
  private readonly assignmentService = new AssignmentService();

  public createAssignment = async (
    req: Request,
    res: CustomResponse<Assignment>,
    next: NextFunction
  ) => {
    try {
      const assignment = await this.assignmentService.createAssignment(
        req.body
      );
      this.send(res, assignment, HttpStatusCode.Created, 'createAssignment');
    } catch (e) {
      next(e);
    }
  };

  public getAllAssignments = async (
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
}
