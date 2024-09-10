import { type NextFunction, type Request } from 'express';
import { type Assignment, type Submission } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import AssignmentService from './Assignment.service';
import { type CustomResponse } from '@/types/common.type';
import Api from '@/lib/api';
import multer from 'multer';
import { uploadToS3 } from '@/lib/s3';

const upload = multer({ dest: 'uploads/' });

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
      this.send(res, count, HttpStatusCode.Ok, 'deletedAllAssignments');
    } catch (e) {
      next(e);
    }
  };

  public createSubmission = async (
    req: Request,
    res: CustomResponse<Submission>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;
      const file = req.file;

      if (!file) throw new Error('No file uploaded');

     
      const submissionFileUrl = await uploadToS3(file);

      const newSubmission = await this.assignmentService.createSubmission({
        ...req.body,
        assignmentId,
        submissionFile: submissionFileUrl,
      });

      this.send(res, newSubmission, HttpStatusCode.Created, 'createSubmission');
    } catch (e) {
      next(e);
    }
  };

  public getSubmissions = async (
    req: Request,
    res: CustomResponse<Submission[]>,
    next: NextFunction
  ) => {
    try {
      const { assignmentId } = req.params;
      const { limit = 10, offset = 0 } = req.query;

      const submissions = await this.assignmentService.getSubmissions(assignmentId, Number(limit), Number(offset));
      this.send(res, submissions, HttpStatusCode.Ok, 'getSubmissions');
    } catch (e) {
      next(e);
    }
  };
}
